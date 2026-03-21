import { InstanceBase, runEntrypoint, TCPHelper, InstanceStatus, combineRgb } from '@companion-module/base'
import { ModuleConfig, getConfigFields } from './config.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { UpdatePresets } from './presets.js'

export class MyModule extends InstanceBase<ModuleConfig> {
	public socket: TCPHelper | undefined
	public buttonStates: { [key: string]: string } = {}
	private blinkState = false
	private blinkTimer: NodeJS.Timeout | undefined
	private connectionLostStep = 0
	private isConnected = false
	private isFlashing = false // Bruges til "Flash on Connect"

	public config: ModuleConfig = { 
		host: '127.0.0.1', 
		port: 9012,
		colorRed: combineRgb(255, 0, 0),
		colorGreen: combineRgb(0, 255, 0),
		colorYellow: combineRgb(255, 255, 0),
		colorOff: combineRgb(0, 0, 0),
		colorText: combineRgb(255, 255, 255),
		blinkSpeed: 750,      // Default hastighed
		connectFlash: true    // Default tilvalg
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config
		this.startBlinkTimer()
		await this.configUpdated(config)
	}

	async destroy() {
		if (this.blinkTimer) clearInterval(this.blinkTimer)
		if (this.socket) this.socket.destroy()
	}

	async configUpdated(config: ModuleConfig) {
		const oldSpeed = this.config.blinkSpeed
		this.config = config
		
		// Genstart timer hvis brugeren ændrer hastigheden i config
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

			this.socket.on('status_change', (status, message) => {
				this.updateStatus(status, message)
				
				// Tjek om vi lige er gået online
				if (!this.isConnected && status === InstanceStatus.Ok && this.config.connectFlash) {
					this.triggerConnectFlash()
				}

				this.isConnected = (status === InstanceStatus.Ok)
				this.checkFeedbacks('button_status')
			})

			this.socket.on('data', (data) => {
				const rawData = data.toString().replace(/[^\x20-\x7E\n]/g, '')
				const lines = rawData.split('\n')
				for (let line of lines) {
					const msg = line.trim()
					if (!msg.startsWith('FB:')) continue
					const parts = msg.split(':')
					if (parts.length >= 3) {
						const id = parts[1].toLowerCase() // Sikrer at nøglen altid er små bogstaver
						const status = parts[2].toUpperCase()
						this.buttonStates[id] = status
						this.checkFeedbacks('button_status')
					}
				}
			})
		}
	}

	// Funktion til at køre 2-sekunders flash
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
		
		// Brug hastighed fra config, ellers standard 750ms
		const interval = this.config.blinkSpeed || 750
		
		this.blinkTimer = setInterval(() => {
			this.blinkState = !this.blinkState
			this.connectionLostStep = (this.connectionLostStep + 1) % 3
			this.checkFeedbacks('button_status')
		}, interval)
	}

	getConfigFields() { return getConfigFields() }
	updateActions() { UpdateActions(this) }
	updateFeedbacks() { UpdateFeedbacks(this) }
	updatePresets() { UpdatePresets(this) }
}
runEntrypoint(MyModule, [])
