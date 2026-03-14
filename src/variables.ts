import type { MyModule } from './main.js'

export function UpdateVariableDefinitions(self: MyModule): void {
	const variables = [
		{ variableId: 'last_command', name: 'Sidste modtagne kommando' },
		{ variableId: 'connection_status', name: 'Forbindelse status' },
	]

	// Du kan også lave en variabel for hver bane, hvis du vil vise tekst-status
	for (let i = 0; i <= 9; i++) {
		variables.push({ variableId: `status_bane${i}`, name: `Status for Bane ${i}` })
	}

	self.setVariableDefinitions(variables)
}
