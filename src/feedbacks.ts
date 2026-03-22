import { MyModule } from './main.js'
import { CompanionAdvancedFeedbackResult, combineRgb } from '@companion-module/base'

export function UpdateFeedbacks(instance: MyModule) {
	instance.setFeedbackDefinitions({
		button_status: {
			type: 'advanced',
			name: 'Knap Status Farve',
			options: [{
				type: 'textinput',
				label: 'Bane ID (f.eks. bane1, nst, officiel)',
				id: 'btnId',
				default: 'bane1',
			}],
			callback: (feedback): CompanionAdvancedFeedbackResult => {
				const config = instance.config // Hent brugerens farvevalg
				
				// 0. FLASH VED FORBINDELSE (Overstyrer alt andet i 2 sekunder)
				if (instance.getIsFlashing()) {
					return { 
						bgcolor: combineRgb(255, 255, 255), 
						color: combineRgb(0, 0, 0) 
					}
				}

				const btnId = (feedback.options.btnId as string).toLowerCase()
				const state = instance.buttonStates[btnId]
				
				// 1. FORBINDELSE MISTET (Bølge-effekt)
				if (instance.getConnectedState() === false) {
					const step = instance.getConnectionStep() % 3
					
					if (step === 0) return { bgcolor: config.colorRed, color: config.colorText }
					if (step === 1) return { bgcolor: config.colorYellow, color: config.colorOff }
					if (step === 2) return { bgcolor: config.colorGreen, color: config.colorOff }
					
					return {}
				}

				// 2. BLINK (Hvis forbundet)
				if (state === 'BLINK') {
					// START-knappen skal ikke blinke, men opføre sig som OFFICIEL (grøn/rød)
					if (btnId === 'start') {
						// Hvis status er BLINK, vis grøn (som officiel), ellers rød
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

				// 3. FASTE FARVER (Hentet fra config)
				if (btnId === 'start') {
					if (state === 'RED') return { bgcolor: config.colorRed, color: config.colorText }
					if (state === 'GREEN') return { bgcolor: config.colorGreen, color: config.colorOff }
					// Start har kun rød og grøn
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
