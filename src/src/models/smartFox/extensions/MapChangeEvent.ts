import { ExtensionResponseEvent } from "./ExtensionResponseEvent";

// See EXTENSION_FUNCTIONS.MAP_CHANGE for the real name of the function.
export interface MapChangeEvent {
	id: number;
}

export function parseMapChangeEvent(e: ExtensionResponseEvent): MapChangeEvent {
	// TODO: to complete
	return {
		id: e.params.id,
	};
}