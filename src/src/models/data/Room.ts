import {SFSRoom} from "sfs2x-api";

export interface Room {
    isGame: boolean;
    isBattle: boolean;
    isChat: boolean;
    name: string;
    group: string;
    ref: SFSRoom;
}