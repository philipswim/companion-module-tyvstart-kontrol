import { SomeCompanionConfigField, combineRgb } from '@companion-module/base'

export interface ModuleConfig {
	host: string
	port: number
	blinkSpeed: number
	connectFlash: boolean
	// Nye farve-felter i din interface
	colorRed: number
	colorGreen: number
	colorYellow: number
	colorOff: number
	colorText: number
}

export function getConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'WPF App IP',
			width: 8,
			default: '127.0.0.1',
		},
		{
			type: 'number',
			id: 'port',
			label: 'Port',
			width: 4,
			min: 1,
			max: 65535,
			default: 9012,
		},
		// Farvevælgere til config-siden
		{
			type: 'colorpicker',
			id: 'colorRed',
			label: 'Rød Farve (Alarm)',
			width: 6,
			default: combineRgb(255, 0, 0),
		},
		{
			type: 'colorpicker',
			id: 'colorGreen',
			label: 'Grøn Farve (OK)',
			width: 6,
			default: combineRgb(0, 255, 0),
		},
		{
			type: 'colorpicker',
			id: 'colorYellow',
			label: 'Gul Farve (Vent)',
			width: 6,
			default: combineRgb(255, 255, 0),
		},
		{
			type: 'colorpicker',
			id: 'colorOff',
			label: 'Slukket Farve',
			width: 6,
			default: combineRgb(0, 0, 0),
		},
		{
			type: 'colorpicker',
			id: 'colorText',
			label: 'Standard Tekstfarve',
			width: 6,
			default: combineRgb(255, 255, 255),
		},
		{
			type: 'number',
			id: 'blinkSpeed',
			label: 'Blink hastighed (ms)',
			width: 6,
			min: 100,
			max: 2000,
			default: 750,
		},
		{
			type: 'checkbox',
			id: 'connectFlash',
			label: 'Flash alle knapper ved forbindelse (2 sek)',
			width: 6,
			default: true,
		},
	]
}
