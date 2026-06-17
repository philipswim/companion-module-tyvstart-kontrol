import type MyModule from './main.js'

export function UpdateVariableDefinitions(self: MyModule): void {
	const variables: Record<string, { name: string }> = {
		last_command: { name: 'Sidste modtagne kommando' },
		connection_status: { name: 'Forbindelse status' },
	}

	// Creates a variable for each lane using the new object format
	for (let i = 0; i <= 9; i++) {
		variables[`status_bane${i}`] = { name: `Status for Bane ${i}` }
	}

	self.setVariableDefinitions(variables)
}
