import { MMORoom } from "sfs2x-api";
import { ExtensionResponseEvent } from "./ExtensionResponseEvent";

export interface GlobalMessageEvent {
    fc: number;
    message: string;
    room: MMORoom;
}

export function parseGlobalMessageEvent(e: ExtensionResponseEvent): GlobalMessageEvent {
    return {
        fc: e.params.get('fc'),
        message: e.params.get(','),
        room: e.room
    }
}