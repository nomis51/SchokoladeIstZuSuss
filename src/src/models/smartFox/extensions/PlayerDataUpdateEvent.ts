import { MMORoom } from "sfs2x-api";
import { ExtensionResponseEvent } from "./ExtensionResponseEvent";

export interface PlayerDataUpdateEvent {
    qa: any[];
    td: any[];
    b: null;
    qd: any[];
    data: {
        np: string;
        tx: number;
        ty: number;
        ns: string;
        cst: null;
        tz: number;
        nt: null;
        mid: number;
        nw: null;
        lpc: string;
        ml: number;
        mp: number;
        cf: number;
        d: number;
        f: number;
        cm: number;
        ra: boolean;
        tf: number;
        nb: string;
        nc: null;
        ne: string;
        nf: string;
        nhr: string;
        tm: number;
        nht: null;
        nf2: null;
        nk: null;
    };
    room: MMORoom;
}

export function parsePlayerDataUpdateEvent(e: ExtensionResponseEvent): PlayerDataUpdateEvent {
    return {
        qa: e.params.get('playerData').get('qa'),
        td: e.params.get('playerData').get('td'),
        b: e.params.get('playerData').get('b'),
        qd: e.params.get('playerData').get('qd'),
        data: {
            np: e.params.get('playerData').get('pd').get('np'),
            tx: e.params.get('playerData').get('pd').get('tx'),
            ty: e.params.get('playerData').get('pd').get('ty'),
            ns: e.params.get('playerData').get('pd').get('ns'),
            cst: e.params.get('playerData').get('pd').get('cst'),
            tz: e.params.get('playerData').get('pd').get('tz'),
            nt: e.params.get('playerData').get('pd').get('nt'),
            mid: e.params.get('playerData').get('pd').get('mid'),
            nw: e.params.get('playerData').get('pd').get('nw'),
            lpc: e.params.get('playerData').get('pd').get('lpc'),
            ml: e.params.get('playerData').get('pd').get('ml'),
            mp: e.params.get('playerData').get('pd').get('mp'),
            cf: e.params.get('playerData').get('pd').get('cf'),
            d: e.params.get('playerData').get('pd').get('d'),
            f: e.params.get('playerData').get('pd').get('f'),
            cm: e.params.get('playerData').get('pd').get('cm'),
            ra: e.params.get('playerData').get('pd').get('ra'),
            tf: e.params.get('playerData').get('pd').get('tf'),
            nb: e.params.get('playerData').get('pd').get('nb'),
            nc: e.params.get('playerData').get('pd').get('nc'),
            ne: e.params.get('playerData').get('pd').get('ne'),
            nf: e.params.get('playerData').get('pd').get('nf'),
            nhr: e.params.get('playerData').get('pd').get('nhr'),
            tm: e.params.get('playerData').get('pd').get('tm'),
            nht: e.params.get('playerData').get('pd').get('nht'),
            nf2: e.params.get('playerData').get('pd').get('nf2'),
            nk: e.params.get('playerData').get('pd').get('nk'),
        },
        room: e.room
    }
}