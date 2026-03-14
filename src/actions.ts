import { MyModule } from './main.js'

export function UpdateActions(instance: MyModule) {
	const actions: any = {}

	// Funktion til at oprette en action hurtigt
	const addAction = (id: string, label: string, command: string) => {
		actions[id] = {
			name: label,
			options: [],
			callback: () => {
				if (instance.socket) {
					// Sender kommandoen efterfulgt af newline
					instance.socket.send(`${command}\n`)
				}
			},
		}
	}

	// Bane knapper (sender kun tallet)
	for (let i = 0; i <= 9; i++) {
		addAction(`bane_${i}`, `Bane ${i}`, `${i}`)
	}

	// Specialtegn og Bogstaver
	addAction('minus', 'Minus (-)', '-')
	addAction('plus', 'Plus (+)', 'plus')
	addAction('f5', 'F5', 'f5')
	addAction('dns', 'DNS', 's')
	addAction('dsq', 'DSQ', 'D')
	addAction('backup', 'Backup', 'B')
	addAction('u', 'U', 'U')
	addAction('yes', 'Yes', 'Y')
	addAction('no', 'No', 'N')
	addAction('official', 'Official', 'f11')
	addAction('naest', 'Næst', 'ctrl+n')
	addAction('scb_on', 'SCB ON', 'ctrl+insert')
	addAction('scb_off', 'SCB OFF', 'ctrl+home')
	addAction('ende', 'Ende', 'space') // Jeg har brugt 'space' her da du skrev 'ende' (mellemrum)

	instance.setActionDefinitions(actions)
}
