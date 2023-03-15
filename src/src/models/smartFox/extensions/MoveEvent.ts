import { SFSRoom } from "sfs2x-api";
import { ExtensionResponseEvent } from "./ExtensionResponseEvent";

export interface MoveEvent {
	r: string;
	x: number;
	y: number;
	z: number;
	mapId: number;
	direction: number;
	is: boolean;
	room: SFSRoom;
}

export function parseMoveEvent(e: ExtensionResponseEvent): MoveEvent {
	return {
		r: e.params.get("r"),
		x: e.params.get('data').get("tx"),
		y: e.params.get('data').get("ty"),
		z: e.params.get('data').get("tz"),
		mapId: e.params.get('data').get("mid"),
		direction: e.params.get('data').get("d"),
		is: e.params.get('data').get("is"),
		room: e.room
	}
}