import { MMORoom } from "sfs2x-api";
import { ExtensionResponseEvent } from "./ExtensionResponseEvent";

export interface BoxesUpdateEvent {
    pokemonBox: any[];
    itemBox: any[];
    currencyBox: any[];
    room: MMORoom;
}

export function parseBoxesUpdateEvent(e: ExtensionResponseEvent): BoxesUpdateEvent {
    return {
        // TODO: need to actually get each sub fields into objects to detach from the SFSObject instance. But, I had no values yet to know what fields I need, which explains why the type in currently "any".
        pokemonBox: e.params.get('pokeBox')._dataHolder.map((e: any) => e),
        itemBox: e.params.get('itemBox')._dataHolder.map((e: any) => e),
        currencyBox: e.params.get('currencyBox')._dataHolder.map((e: any) => e),
        room: e.room,
    }
}