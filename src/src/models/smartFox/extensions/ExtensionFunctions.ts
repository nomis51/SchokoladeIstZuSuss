// call.g.xxxx = chat related event
// call.u.xxxx = user related event

export const EXTENSION_FUNCTIONS = {
	MOVE: 'move',
	READY: 'c.ready',
	UPDATE_BATTLE_QUEUE_RATING: 'call.updateBattleQueueRating',
	CHANGE_MAP: 'pf.pl.cm',
	BATTLE_INIT: 'call.u.dexEntry',
	BATTLE_ROOM_READY: 'battle.roomReady',
	BATTLE_SIM_REQUEST: 'battle.simRequest',
	BATTLE_UPDATE: 'battle.update',
	GLOBAL_MESSAGE: 'call.c.g',
	LOCAL_MESSAGE: 'call.c.l',
	ACHIEVEMENTS: 'call.achievements',
	CALL_U_I: "call.u.i", // TODO: no idea what is this, rename to a better name. Maybe it's something like "user interface" ?
	BATTLE_END: 'battle.end',
	POKEMONS_AFTER_BATTLE_UPDATE: 'call.u.pt',
	BOXES_UPDATE: 'call.u.boxes',
	PLAYER_DATA_UPDATE: 'call.u.playerData',
	WORLD_BLESSING: 'call.worldBlessing',
};