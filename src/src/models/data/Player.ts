import { SFSUser } from "sfs2x-api";
import { Position } from "./Position";

export interface Player {
    id: number;
    username: string;
    hashedPassword: string;
    isMoving: boolean;
    position: Position;
    destinationPositions?: Position;
    step: number;
    ref?: SFSUser;
}