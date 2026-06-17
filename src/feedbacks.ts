import MyModule from './main.js'
import { CompanionAdvancedFeedbackResult, combineRgb } from '@companion-module/base'

export function UpdateFeedbacks(instance: MyModule) {
	instance.setFeedbackDefinitions({
		button_status: {
			type: 'advanced',
			name: 'Button Status Color',
			options: [{
				type: 'textinput',
				label: 'Lane ID (e.g., bane1, nst, officiel)',
				id: 'btnId',
				default: 'bane1',
			}],
			callback: (feedback: any): CompanionAdvancedFeedbackResult => {
				const config = instance.config // Fetch user color choices
				
				// 0. FLASH ON CONNECTION (Overrides everything else for 2 seconds)
				if (instance.getIsFlashing()) {
					return { 
						bgcolor: combineRgb(255, 255, 255), 
						color: combineRgb(0, 0, 0) 
					}
				}

				const btnId = (feedback.options.btnId as string).toLowerCase()
				const state = instance.buttonStates[btnId]
				
				// 1. CONNECTION LOST (Wave effect)
				if (instance.getConnectedState() === false) {
					const step = instance.getConnectionStep() % 3
					
					if (step === 0) return { bgcolor: config.colorRed, color: config.colorText }
					if (step === 1) return { bgcolor: config.colorYellow, color: config.colorOff }
					if (step === 2) return { bgcolor: config.colorGreen, color: config.colorOff }
					
					return {}
				}

				// 2. BLINK (If connected)
				if (state === 'BLINK') {
					// START button should not blink, but behave like OFFICIAL (green/red)
					if (btnId === 'start') {
						// If status is BLINK, show green (like official), otherwise red
						return { bgcolor: config.colorGreen, color: config.colorOff }
					}
					if (!instance.getBlinkState()) {
						return { bgcolor: config.colorOff, color: config.colorText }
					}
					const isGreen = (btnId === 'officiel' || btnId === 'nst' || btnId === 'næst')
					return { 
						bgcolor: isGreen ? config.colorGreen : config.colorRed, 
						color: isGreen ? config.colorOff : config.colorText 
					}
				}

				// 3. FIXED COLORS (Fetched from config)
				if (btnId === 'start') {
					if (state === 'RED') return { bgcolor: config.colorRed, color: config.colorText }
					if (state === 'GREEN') return { bgcolor: config.colorGreen, color: config.colorOff }
					// Start only has red and green
					return { bgcolor: config.colorOff, color: config.colorText }
				}
				if (state === 'RED') return { bgcolor: config.colorRed, color: config.colorText }
				if (state === 'GREEN') return { bgcolor: config.colorGreen, color: config.colorOff }
				if (state === 'YELLOW') return { bgcolor: config.colorYellow, color: config.colorOff }
				if (state === 'OFF') return { bgcolor: config.colorOff, color: config.colorText }
				if (typeof state === 'string' && state.toUpperCase() === 'REDBLINK') {
					if (!instance.getBlinkState()) {
						return { bgcolor: config.colorOff, color: config.colorText }
					}
					return { bgcolor: config.colorRed, color: config.colorOff }
				}

				return {}
			},
		},
	})
}
