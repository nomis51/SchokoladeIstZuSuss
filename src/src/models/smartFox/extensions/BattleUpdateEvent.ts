import { SFSRoom } from "sfs2x-api";
import { ExtensionResponseEvent } from "./ExtensionResponseEvent";

export interface BattleUpdateEvent {
    requestType: string;
    request: string[][];
    room: SFSRoom;
}

export const parseBattleUpdateEvent = (e: ExtensionResponseEvent): BattleUpdateEvent => {
    return {
        request: e.params.get('request').split('\n').map(v => v.split('|').filter(v => !!v)),
        requestType: e.params.get('requestType'),
        room: e.room
    }
};
