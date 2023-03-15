import { SFSRoom } from "sfs2x-api";
import { ExtensionResponseEvent } from "./ExtensionResponseEvent";

export interface BattleSimRequestEvent {
    request: string;
    data: PlayerBattleInfo;
    room: SFSRoom;
}

export interface PlayerBattleInfo {
    active: {
        canZMove: any[];
        moves: {
            disabled: boolean;
            id: string;
            maxpp: number;
            move: string;
            pp: number;
            target: string;
        }[];
        pokemonId: string;
        teamSlot: number;
    }[];
    rqid: number;
    side: {
        id: string;
        name: string;
        pokemon: {
            ability: string;
            active: boolean;
            baseAbility: string;
            condition: string;
            conditionValues: {
                value: number;
                max: number;
            };
            details: string;
            ident: string;
            item: string;
            moves: string[];
            pokeball: string;
            pokemonId: string;
            stats: {
                atk: number;
                def: number;
                hp: number;
                spa: number;
                spd: number;
                spe: number;
            }
            teamSlot: number;
        }[]
    }
}

export const parseBattleSimRequest = (e: ExtensionResponseEvent) => {
    return JSON.parse(e.params.get('request').replace('|request|', ''));
}