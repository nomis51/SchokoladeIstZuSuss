import {SFSRoom} from "sfs2x-api";

export interface PublicMessageEvent {
    message: string;
    room: SFSRoom;
    sender: {
        id: number;
        name: string;
        privilegeId: number;
    }
}
