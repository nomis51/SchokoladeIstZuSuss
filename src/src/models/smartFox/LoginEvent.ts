import {SFSUser} from "sfs2x-api";

export interface LoginEvent {
    user: SFSUser;
    zone: string;
}