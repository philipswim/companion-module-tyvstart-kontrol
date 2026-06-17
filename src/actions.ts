import  MyModule  from './main.js'

export function UpdateActions(instance: MyModule) {
	const actions: any = {}

	// Helper function to quickly register an action
	const addAction = (id: string, label: string, command: string) => {
		actions[id] = {
			name: label,
			options: [],
			callback: () => {
				if (instance.socket) {
					// Sends the command followed by a newline character
					instance.socket.send(`${command}\n`)
				}
			},
		}
	}

	// Lane buttons (sends the digit directly)
	for (let i = 0; i <= 9; i++) {
		addAction(`bane_${i}`, `Bane ${i}`, `${i}`)
	}

	// Special Characters and Letters
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
	addAction('ende', 'Ende', 'space') // I used 'space' here because you wrote 'ende' (space)
	addAction('start', 'Start', 'start')

	instance.setActionDefinitions(actions)
}
