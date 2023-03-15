import { MMORoom } from "sfs2x-api";
import { ExtensionResponseEvent } from "./ExtensionResponseEvent";

export interface PokemonsAfterBattleUpdateEvent {
    pokemons: {
        a: string;
        hi: null;
        hid: number;
        b: number;
        isShy: boolean;
        ms: {
            mid: string;
            sn: number;
        }[];
        name: string;
        h: number;
        mid: number;
        pid: string;
        chp: number;
        l: number;
        txp: number;
        iv: {
            def: number;
            spa: number;
            spd: number;
            hp: number;
            spe: number;
            atk: number;
        };
        n: string;
        sid: string;
        ev: {
            def: number;
            spa: number;
            spd: number;
            hp: number;
            spe: number;
            atk: number;
        };
        s: number;
        mb: string[];
        exp: number;
        cb: string;
    }[];
    room: MMORoom
}

export function parsePokemonsAfterBattleEvent(e: ExtensionResponseEvent): PokemonsAfterBattleUpdateEvent {
    return {
        pokemons: e.params.get('pt')._dataHolder.map((p: any) => ({
            a: p.value._dataHolder.get('a').value,
            hi: p.value._dataHolder.get('hi').value,
            hid: p.value._dataHolder.get('hid').value,
            b: p.value._dataHolder.get('b').value,
            isShy: p.value._dataHolder.get('shy').value,
            ms: p.value._dataHolder.get('ms').value._dataHolder.map((m: any) => ({
                mid: m.value._dataHolder.get('mid').value,
                sn: m.value._dataHolder.get('sn').value,
            })),
            name: p.value._dataHolder.get('gn').value,
            h: p.value._dataHolder.get('h').value,
            mid: p.value._dataHolder.get('mid').value,
            pid: p.value._dataHolder.get('pid').value,
            chp: p.value._dataHolder.get('chp').value,
            l: p.value._dataHolder.get('l').value,
            txp: p.value._dataHolder.get('txp').value,
            n: p.value._dataHolder.get('n').value,
            sid: p.value._dataHolder.get('sid').value,
            s: p.value._dataHolder.get('s').value,
            mb: p.value._dataHolder.get('mb').value,
            exp: p.value._dataHolder.get('exp').value,
            cb: p.value._dataHolder.get('cb').value,
            ev: {
                def: p.value._dataHolder.get('ev').value._dataHolder.get('def').value,
                spa: p.value._dataHolder.get('ev').value._dataHolder.get('spa').value,
                spd: p.value._dataHolder.get('ev').value._dataHolder.get('spd').value,
                hp: p.value._dataHolder.get('ev').value._dataHolder.get('hp').value,
                spe: p.value._dataHolder.get('ev').value._dataHolder.get('spe').value,
                atk: p.value._dataHolder.get('ev').value._dataHolder.get('atk').value,
            },
            iv: {
                def: p.value._dataHolder.get('iv').value._dataHolder.get('def').value,
                spa: p.value._dataHolder.get('iv').value._dataHolder.get('spa').value,
                spd: p.value._dataHolder.get('iv').value._dataHolder.get('spd').value,
                hp: p.value._dataHolder.get('iv').value._dataHolder.get('hp').value,
                spe: p.value._dataHolder.get('iv').value._dataHolder.get('spe').value,
                atk: p.value._dataHolder.get('iv').value._dataHolder.get('atk').value,
            }
        })),
        room: e.room
    }
}