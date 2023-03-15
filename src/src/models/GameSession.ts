import { Player } from "./data/Player";
import { Map } from './data/Map';
import { Room } from './data/Room'
import { ServerInfo } from "./data/ServerInfo";

export interface GameSession {
    serverInfo: ServerInfo;
    isConnected: boolean;
    isLoggedIn: boolean;
    zone: string;
    player: Player;
    map: Map;
    rooms: Room[];
}

export const DEFAULT_GAME_SESSION: GameSession = {
    serverInfo: {
        host: "",
        port: -1,
        useSsl: true,
        lastLagValue: 0,
    },
    isConnected: false,
    isLoggedIn: false,
    zone: "",
    player: {
        id: -1,
        username: "",
        hashedPassword: "",
        isMoving: false,
        position: {
            x: -1,
            y: -1,
            z: -1
        },
        destinationPositions: undefined,
        step: 0,
        ref: undefined
    },
    map: {
        id: -1,
        name: "",
    },
    rooms: []
};