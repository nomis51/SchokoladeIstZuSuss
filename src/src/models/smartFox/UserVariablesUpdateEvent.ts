import {SFSUser} from "sfs2x-api";

export interface UserVariablesUpdateEvent {
    changedVars: string[];
    user: SFSUser;
}