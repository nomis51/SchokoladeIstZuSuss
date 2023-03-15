import { MMORoom } from "sfs2x-api";
import { ExtensionResponseEvent } from "./ExtensionResponseEvent";

export interface BattleInitEvent {
	s: boolean;
	c: boolean;
	n: number;
	o: boolean;
	room: MMORoom;
}

export function parseBattleInitEvent(e: ExtensionResponseEvent): BattleInitEvent {
	return {
		s: e.params.get('s'),
		c: e.params.get('c'),
        n: e.params.get('n'),
        o: e.params.get('o'),
        room: e.room
	}
}