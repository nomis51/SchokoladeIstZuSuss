import { ExtensionResponseEvent } from "./ExtensionResponseEvent";

export interface WorldBlessingEvent {
	mod: number;
	usedAt: string;
	expiresAt: number;
	player: string;
}

export function parseWorldBlessingEvent(e: ExtensionResponseEvent): WorldBlessingEvent {
	return {
		mod: e.params.get('mod'),
		usedAt: e.params.get('usedAt'),
		expiresAt: e.params.get('expiresAt'),
		player: e.params.get('player')
	}
}