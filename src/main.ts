import { InstanceBase, TCPHelper, InstanceStatus, combineRgb } from '@companion-module/base'
import { ModuleConfig, getConfigFields } from './config.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { UpdatePresets } from './presets.js'

export default class MyModule extends InstanceBase<any> {
	public socket: TCPHelper | undefined
	public buttonStates: { [key: string]: string } = {}
	private blinkState = false
	private blinkTimer: any
	private connectionLostStep = 0
	private isConnected = false
	private isFlashing = false // Used for "Flash on Connect"

	public config: ModuleConfig = { 
		host: '127.0.0.1', 
		port: 9012,
		colorRed: combineRgb(255, 0, 0),
		colorGreen: combineRgb(0, 255, 0),
		colorYellow: combineRgb(255, 255, 0),
		colorOff: combineRgb(0, 0, 0),
		colorText: combineRgb(255, 255, 255),
		blinkSpeed: 750,      // Default speed
		connectFlash: true    // Default option
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config
		this.startBlinkTimer()
		this.configUpdated(config)
	}

	async destroy() {
		if (this.blinkTimer) clearInterval(this.blinkTimer)
		if (this.socket) this.socket.destroy()
	}

	async configUpdated(config: ModuleConfig) {
		const oldSpeed = this.config.blinkSpeed
		this.config = config
		
		// Restart timer if user changes speed in config
		if (oldSpeed !== config.blinkSpeed) {
			this.startBlinkTimer()
		}

		this.init_tcp(config)
		this.updateActions()
		this.updateFeedbacks()
		this.updatePresets()
	}

	init_tcp(config: ModuleConfig) {
		if (this.socket) {
			this.socket.destroy()
			delete this.socket
		}

		if (config && config.host) {
			this.socket = new TCPHelper(config.host, config.port)

			// CATCH NETWORK ERRORS: Ensures the module survives if the WPF app is closed
			;(this.socket as any).on('error', (err: any) => {
				this.updateStatus(InstanceStatus.ConnectionFailure, err.message || 'Connection refused')
				this.isConnected = false
				this.checkFeedbacks('button_status')
			})

			;(this.socket as any).on('status_change', (status: InstanceStatus, message?: string) => {
				this.updateStatus(status, message)
				
				// Check if we just went online
				if (!this.isConnected && status === InstanceStatus.Ok && this.config.connectFlash) {
					this.triggerConnectFlash()
				}

				this.isConnected = (status === InstanceStatus.Ok)
				this.checkFeedbacks('button_status')
			})

			;(this.socket as any).on('data', (data: Buffer) => {
				const rawData = data.toString().replace(/[^\x20-\x7E\n]/g, '')
				const lines = rawData.split('\n')
				for (let line of lines) {
					const msg = line.trim()
					if (!msg.startsWith('FB:')) continue
					const parts = msg.split(':')
					if (parts.length >= 3) {
						const id = parts[1].toLowerCase() // Your working logic for lowercase
						const status = parts[2].toUpperCase()
						this.buttonStates[id] = status
						this.checkFeedbacks('button_status')
					}
				}
			})
		}
	}

	// Function to run 2-second flash
	private triggerConnectFlash() {
		this.isFlashing = true
		this.checkFeedbacks('button_status')
		setTimeout(() => {
			this.isFlashing = false
			this.checkFeedbacks('button_status')
		}, 2000)
	}

	public getBlinkState() { return this.blinkState }
	public getConnectionStep() { return this.connectionLostStep }
	public getConnectedState() { return this.isConnected }
	public getIsFlashing() { return this.isFlashing }

	private startBlinkTimer() {
		if (this.blinkTimer) clearInterval(this.blinkTimer)
		
		// Use speed from config, otherwise default 750ms
		const interval = this.config.blinkSpeed || 750
		
		this.blinkTimer = setInterval(() => {
			this.blinkState = !this.blinkState
			this.connectionLostStep = (this.connectionLostStep + 1) % 3
			this.checkFeedbacks('button_status')
		}, interval)
	}

	getConfigFields() { return getConfigFields() }
updateActions() { UpdateActions(this as any) }
updateFeedbacks() { UpdateFeedbacks(this as any) }
updatePresets() { UpdatePresets(this as any) }

}
