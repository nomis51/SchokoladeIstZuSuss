export interface Map {
    id: number;
    name: string;
    exits: MapExit[];
}

interface MapExit {
    x: number;
    y: number;
    to: {
        mapId: number;
        x: number;
        y: number;
    }
}