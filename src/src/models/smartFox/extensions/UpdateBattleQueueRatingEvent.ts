import { MMORoom } from "sfs2x-api";
import { ExtensionResponseEvent } from "./ExtensionResponseEvent";

export interface UpdateBattleQueueRatingEvent {
    battleQueueRating: number;
    battleQueuePoints: number;
    battleQueueWeekly: number;
    room: MMORoom;
}

export function parseUpdateBattleQueueRatingEvent(e: ExtensionResponseEvent): UpdateBattleQueueRatingEvent {
    return {
        battleQueueRating: e.params.get('bqRating'),
        battleQueuePoints: e.params.get('bqPoints'),
        battleQueueWeekly: e.params.get('bqWeekly'),
        room: e.room
    }
}