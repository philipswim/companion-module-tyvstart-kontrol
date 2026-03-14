import { combineRgb, CompanionPresetDefinitions } from '@companion-module/base'
import { MyModule } from './main.js' // Sørg for at stien matcher din hovedfil

export function UpdatePresets(instance: MyModule) {
	const presets: CompanionPresetDefinitions = {}
	const config = instance.config

	// Ny hjælpefunktion med 'category' parameter
	const addPreset = (category: string, id: string, text: string, actionId: string, fbId: string) => {
		presets[id] = {
			type: 'button',
			category: `Tyvstart: ${category}`, // Gør kategorien tydelig
			name: text,
			style: {
				text: text,
				size: '18',
				color: config.colorText,
				bgcolor: config.colorOff,
			},
			steps: [
				{
					down: [{ actionId: actionId, options: {} }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'button_status',
					options: { btnId: fbId },
				},
			],
		}
	}

	// --- 1. BANER (0-9) ---
	for (let i = 0; i <= 9; i++) {
		addPreset('Baner', `preset_bane_${i}`, `Bane ${i}`, `bane_${i}`, `bane${i}`)
	}

	// --- 2. KONTROL (Vigtige funktioner) ---
	addPreset('Kontrol', 'preset_officiel', 'OFFICIEL', 'official', 'officiel')
	addPreset('Kontrol', 'preset_naest', 'NÆST', 'naest', 'nst')
	addPreset('Kontrol', 'preset_dns', 'DNS', 'dns', 'dns')
	addPreset('Kontrol', 'preset_dsq', 'DSQ', 'dsq', 'dsq')

	// --- 3. SYSTEM (Navigation/Backup) ---
	addPreset('System', 'preset_f5', 'F5', 'f5', 'f5')
	addPreset('System', 'preset_backup', 'Backup', 'backup', 'backup')
	addPreset('System', 'preset_plus', '+', 'plus', '+')
	addPreset('System', 'preset_minus', '-', 'minus', '-')
	addPreset('System', 'preset_yes', 'YES', 'yes', 'yes')
	addPreset('System', 'preset_no', 'NO', 'no', 'no')
	addPreset('System', 'preset_ende', 'ENDE', 'ende', 'ende')
	// --- 4. SCOREBOARD ---
	addPreset('Scoreboard', 'preset_scb_on', 'SCB ON', 'scb_on', 'scb_on')
	addPreset('Scoreboard', 'preset_scb_off', 'SCB OFF', 'scb_off', 'scb_off')
	

	instance.setPresetDefinitions(presets)
}
