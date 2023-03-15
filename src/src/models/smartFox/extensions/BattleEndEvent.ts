import { SFSRoom } from "sfs2x-api";
import { ExtensionResponseEvent } from "./ExtensionResponseEvent";

export interface BattleEndEvent {
    tie: boolean;
    data: any;
    winner: string;
    isWinnerYou: boolean;
    room: SFSRoom;
}

export function parseBattleEndEvent(e: ExtensionResponseEvent): BattleEndEvent {
    return {
        tie: e.params.get('tie'),
        data: e.params.get('data'),
        winner: e.params.get('w'),
        isWinnerYou: e.params.get('w') === 'p1', // TODO: might be different in multiplayer battles
        room: e.room
    }
}