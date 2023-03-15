export interface PlayerMovementOptions {
	direction: Direction;
	amount?: number;
	showMovements?: boolean;
}

export type Direction = "left" | "right" | "up" | "down";