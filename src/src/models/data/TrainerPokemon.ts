import {Move} from "./Move";
import {Stats} from "./Stats";
import {Pokemon} from "./Pokemon";

export interface TrainerPokemon extends Pokemon {
    isActive: boolean;
    teamSlot: number;
    moves: Move[];
    ability: string;
    baseAbility: string;
    hp: {
        current: number;
        max: number;
    };
    details: string;
    ident: string;
    item: string;
    pokeball: string;
    stats: Stats;
}