import { SFSRoom } from "sfs2x-api";
import { ExtensionResponseEvent } from "./ExtensionResponseEvent";

export interface BattleRoomReadyEvent {
    data: number;
    room: SFSRoom;
}

export function parseBattleRoomReadyEvent(e: ExtensionResponseEvent): BattleRoomReadyEvent {
    return {
        data: e.params.get('data'),
        room: e.room
    }
}