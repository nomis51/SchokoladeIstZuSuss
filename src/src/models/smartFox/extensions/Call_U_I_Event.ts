import { MMORoom } from "sfs2x-api";
import { ExtensionResponseEvent } from "./ExtensionResponseEvent";

// TODO: no idea what this is for. Give a better name once this is sorted out.
export interface Call_U_I_Event {
    i: {
        st: number;
        c: number;
        e: boolean;
        hashcode: number;
        mid: number;
        sn: number;
        dc: number;
    }[];
    room: MMORoom;
}

// TODO: rename according to the Event name above
export function parseCall_U_I_Event(e: ExtensionResponseEvent): Call_U_I_Event {
    return {
        i: e.params.get('i')._dataHolder.map((i: any) => ({
            st: i.value._dataHolder.get('st').value,
            c: i.value._dataHolder.get('c').value,
            e: i.value._dataHolder.get('e').value,
            hashcode: i.value._dataHolder.get('hashcode').value,
            mid: i.value._dataHolder.get('mid').value,
            sn: i.value._dataHolder.get('sn').value,
        })),
        room: e.room
    }
}