import { CompanionPresetDefinitions } from '@companion-module/base'
import MyModule from './main.js'

export function UpdatePresets(instance: MyModule) {
	const presetDefinitions: any = {}
	const config = instance.config

	// Helper function to build raw preset definitions
	const addPreset = (category: string, id: string, text: string, actionId: string | null, fbId: string) => {
		presetDefinitions[id] = {
			type: 'simple', // Correct type according to API 2.0 documentation
			name: text,
			style: {
				text: text,
				size: '18',
				color: config.colorText,
				bgcolor: config.colorOff,
			},
			steps: [
				{
					down: actionId ? [{ actionId: actionId, options: {} }] : [],
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

	// --- 1. BUILD ALL RAW DEFINITIONS (presets) ---
	
	// Lane (0-9)
	for (let i = 0; i <= 9; i++) {
		addPreset('Baner', `preset_bane_${i}`, `Bane ${i}`, `bane_${i}`, `bane${i}`)
	}

	// Control
	addPreset('Kontrol', 'preset_officiel', 'OFFICIEL', 'official', 'officiel')
	addPreset('Kontrol', 'preset_naest', 'NÆST', 'naest', 'nst')
	addPreset('Kontrol', 'preset_dns', 'DNS', 'dns', 'dns')
	addPreset('Kontrol', 'preset_dsq', 'DSQ', 'dsq', 'dsq')

	// System
	addPreset('System', 'preset_f5', 'F5', 'f5', 'f5')
	addPreset('System', 'preset_backup', 'Backup', 'backup', 'backup')
	addPreset('System', 'preset_plus', '+', 'plus', '+')
	addPreset('System', 'preset_minus', '-', 'minus', '-')
	addPreset('System', 'preset_yes', 'YES', 'yes', 'yes')
	addPreset('System', 'preset_no', 'NO', 'no', 'no')
	addPreset('System', 'preset_u', 'U', 'u', 'u')
	addPreset('System', 'preset_ende', 'ENDE', 'ende', 'ende')
	addPreset('System', 'preset_start', 'START', null, 'start')
	
	// Scoreboard
	addPreset('Scoreboard', 'preset_scb_on', 'SCB ON', 'scb_on', 'scb_on')
	addPreset('Scoreboard', 'preset_scb_off', 'SCB OFF', 'scb_off', 'scb_off')


	// --- 2. BUILD THE STRUCTURE (layout/sections) ---
	// Here we only link to the ID strings in the 'definitions' array.
	const presetsStructure = [
		{
			id: 'section-baner',
			name: 'Tyvstart: Baner',
			definitions: [
				'preset_bane_0', 'preset_bane_1', 'preset_bane_2', 
				'preset_bane_3', 'preset_bane_4', 'preset_bane_5', 
				'preset_bane_6', 'preset_bane_7', 'preset_bane_8', 'preset_bane_9'
			]
		},
		{
			id: 'section-kontrol',
			name: 'Tyvstart: Kontrol',
			definitions: ['preset_officiel', 'preset_naest', 'preset_dns', 'preset_dsq']
		},
		{
			id: 'section-system',
			name: 'Tyvstart: System',
			definitions: [
				'preset_f5', 'preset_backup', 'preset_plus', 'preset_minus', 
				'preset_yes', 'preset_no', 'preset_u', 'preset_ende', 'preset_start'
			]
		},
		{
			id: 'section-scoreboard',
			name: 'Tyvstart: Scoreboard',
			definitions: ['preset_scb_on', 'preset_scb_off']
		}
	]

	// --- 3. CALL ORDER ---
	// The first argument is the structure (layout), the second argument is the actual definitions.
	instance.setPresetDefinitions(presetsStructure as any, presetDefinitions)
}
