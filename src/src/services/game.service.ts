import { ExtensionRequest, LoginRequest, PublicMessageRequest, SFSEvent, SFSObject, SFSUser, SmartFox } from "sfs2x-api";
import { ConnectionEvent } from "../models/smartFox/ConnectionEvent";
import { DEFAULT_GAME_SESSION, GameSession } from "../models/GameSession";
import { Logger } from "./logger.service";
import { ConnectionLostEvent } from "../models/smartFox/ConnectionLostEvent";
import { LoginEvent } from "../models/smartFox/LoginEvent";
import { getLoginErrorMessage, LoginErrorEvent } from "../models/smartFox/LoginErrorEvent";
import { UserVariablesUpdateEvent } from "../models/smartFox/UserVariablesUpdateEvent";
import { RoomJoinEvent } from "../models/smartFox/RoomJoinEvent";
import { RoomJoinErrorEvent } from "../models/smartFox/RoomJoinErrorEvent";
import { LoginOptions } from "../models/LoginOptions";
import { ConnectOptions } from "../models/ConnectOptions";
import { PingPongEvent } from "../models/smartFox/PingPongEvent";
import { PlayerMovementOptions } from "../models/PlayerMovementOptions";
import { Room } from "../models/data/Room";
import { Position } from "../models/data/Position";
import { EXTENSION_FUNCTIONS } from "../models/smartFox/extensions/ExtensionFunctions";
import { ExtensionResponseEvent } from '../models/smartFox/extensions/ExtensionResponseEvent'
import { MapChangeEvent, parseMapChangeEvent } from "../models/smartFox/extensions/MapChangeEvent";
import { ChangeMapOptions } from "../models/ChangeMapOptions";
import { Map } from "../models/data/Map";
import { Player } from "../models/data/Player";
import { ConfigService } from "./config.service";
import { MoveEvent, parseMoveEvent } from "../models/smartFox/extensions/MoveEvent";
import { parseUpdateBattleQueueRatingEvent, UpdateBattleQueueRatingEvent } from "../models/smartFox/extensions/UpdateBattleQueueRatingEvent";
import { BattleInitEvent, parseBattleInitEvent } from "../models/smartFox/extensions/BattleInitEvent";
import { BattleRoomReadyEvent, parseBattleRoomReadyEvent } from "../models/smartFox/extensions/BattleRoomReadyEvent";
import { BattleSimRequestEvent, parseBattleSimRequest as parseBattleSimRequestEvent } from "../models/smartFox/extensions/BattleSimRequestEvent";
import { BattleUpdateEvent, parseBattleUpdateEvent } from "../models/smartFox/extensions/BattleUpdateEvent";
import { GlobalMessageEvent, parseGlobalMessageEvent } from "../models/smartFox/extensions/GlobalMessageEvent";
import { LocalMessgeEvent, parseLocalMessageEvent } from "../models/smartFox/extensions/LocalMessageEvent";
import { AchievementsEvent, parseAchievementsEvent } from "../models/smartFox/extensions/AchievementsEvent";
import { Call_U_I_Event, parseCall_U_I_Event } from "../models/smartFox/extensions/Call_U_I_Event";
import { BattleEndEvent, parseBattleEndEvent } from "../models/smartFox/extensions/BattleEndEvent";
import { parsePokemonsAfterBattleEvent, PokemonsAfterBattleUpdateEvent } from "../models/smartFox/extensions/PokemonsAfterBattleUpdateEvent";
import { BoxesUpdateEvent, parseBoxesUpdateEvent } from "../models/smartFox/extensions/BoxesUpdateEvent";
import { parsePlayerDataUpdateEvent, PlayerDataUpdateEvent } from "../models/smartFox/extensions/PlayerDataUpdateEvent";
import { parseWorldBlessingEvent, WorldBlessingEvent } from "../models/smartFox/extensions/WorldBlessingEvent";
import { BattleActionOptions } from "../models/BattleActionOptions";

class GameServiceImpl {
    /**
     * Members
     */
    private readonly _sfs: SmartFox;
    private readonly _session: GameSession = DEFAULT_GAME_SESSION;

    /**
     * Props
     */
    public get isConnected(): boolean {
        return this._session.isConnected;
    }

    public get isConnectionConfigured(): boolean {
        return !!this._session.serverInfo.host &&
            !!this._session.serverInfo.port;
    }

    public get isLoggedIn(): boolean {
        return this._session.isLoggedIn;
    }

    public get isReady(): boolean {
        return !!this.gameRoom;
    }

    public get gameRoom(): Room | undefined {
        return this._session.rooms.find(r => r.isGame);
    }

    public get globalChatRoom(): Room | undefined {
        return this._session.rooms.find(r => r.isChat && r.name === 'Global');
    }

    public get battleRoom(): Room | undefined {
        return this._session.rooms.find(r => r.isBattle);
    }

    public get player(): Player | undefined {
        return this._session.player;
    }

    public get currentMap(): Map | undefined {
        return this._session.map;
    }

    /**
     * Constructor
     */
    constructor(debug: boolean) {
        (window as any).gameService = this;
        this._sfs = new SmartFox({
            debug
        });
        this.initializeEventHandlers();
    }

    /**
     * Public functions
     */
    public connect(options: ConnectOptions): void {
        this._sfs.connect(options.host, options.port, options.useSsl);

        this._session.serverInfo.host = options.host;
        this._session.serverInfo.port = options.port;
        this._session.serverInfo.useSsl = options.useSsl;
    }

    public disconnect(): void {
        this._sfs.disconnect();
    }

    public reconnect(): boolean {
        if (!this.isConnectionConfigured) return false;

        this._sfs.connect(this._session.serverInfo.host, this._session.serverInfo.port, this._session.serverInfo.useSsl);

        return true;
    }

    public login(options: LoginOptions): boolean {
        if (!this._session.isConnected) return false;

        const params = new SFSObject();
        params.putUtfString("password", options.hashedPassword);
        params.putBool("rs", options.rs);
        params.putUtfString("dn", options.username);
        params.putLong("id", options.userId);
        params.putUtfString("version", options.version);

        // TODO: options.username.toLowerCase() might not be the right encoding with special characters.
        this._sfs.send(new LoginRequest(options.username.toLowerCase(), undefined, params, options.zone));

        this._session.player.id = options.userId;
        this._session.player.username = options.username;
        this._session.player.hashedPassword = options.hashedPassword;
        this._session.zone = options.zone;

        return true;
    }

    public sendReady(): boolean {
        if (!this.isLoggedIn) return false;

        this._sfs.send(new ExtensionRequest(EXTENSION_FUNCTIONS.READY));
        return true;
    }

    public movePlayer(options: PlayerMovementOptions): boolean {
        if (!this.isLoggedIn) return false;
        if (!this.gameRoom) return false;

        const nextPosition = this.getNextPosition(options.direction, options.amount);
        return this.movePlayerRaw(nextPosition.x, nextPosition.y, options);
    }

    public movePlayerRaw(x: number, y: number, options: PlayerMovementOptions): boolean {
        if (!this.isLoggedIn) return false;
        if (!this.gameRoom) return false;

        const params = new SFSObject();
        params.putInt('mid', this._session.map.id);
        params.putLong('id', this._session.player.step + 1);
        params.putLong('step', this._session.player.step);
        params.putInt('d', this.getDirectionId(options.direction));
        params.putInt('x', this._session.player.position.x);
        params.putInt('y', this._session.player.position.y);
        params.putInt('tx', x);
        params.putInt('ty', y);
        params.putInt('layer', this._session.player.position.z ?? 0);
        params.putBool('sm', options.showMovements ?? true);

        this._session.player.destinationPositions = {
            x,
            y
        };
        this._session.player.isMoving = true;
        this._sfs.send(new ExtensionRequest(EXTENSION_FUNCTIONS.MOVE, params, this.gameRoom.ref));

        ++this._session.player.step;
        return true;
    }

    public changeMap(options: ChangeMapOptions): boolean {
        if (!this.isLoggedIn) return false;
        if (!this.gameRoom) return false;
        if (this.currentMap?.id === options.id) return false;

        const params = new SFSObject();
        params.putInt('mid', options.id);
        params.putInt('x', options.x);
        params.putInt('y', options.y);

        this._sfs.send(new ExtensionRequest(EXTENSION_FUNCTIONS.CHANGE_MAP, params, this.gameRoom.ref));
        return true;
    }

    public sendChatMessage(message: string): boolean {
        if (!this.isConnected) return false;
        if (!this.isLoggedIn) return false;
        if (!this.globalChatRoom) return false;

        this._sfs.send(new PublicMessageRequest(message, undefined, this.globalChatRoom?.ref));
        return true;
    }

    public doBattleAction(options: BattleActionOptions): boolean {
        if (!this.isConnected) return false;
        if (!this.isLoggedIn) return false;
        if (!this.battleRoom) return false;

        let msg = '';

        if (options.moveNum && options.moveNum > 0 && options.moveNum < 5) {
            msg = `move ${options.moveNum}`;
        } else if (options.itemId && options.itemId > 0) {
            const item = ConfigService.retrieveItem(options.itemId);
            if (!item) return false;
            msg = `bag ${item.id} ${item.useOperation}`;
        } else if (options.doRun) {
            msg = 'run';
        }

        const params = new SFSObject();
        params.putUtfString('choice', msg);

        this._sfs.send(new ExtensionRequest('battle.makeChoice', params, this.battleRoom?.ref));
        return true;
    }


    /**
     * Private functions
     */
    private initializeEventHandlers() {
        this.addHandler(SFSEvent.CONNECTION, this.onConnection.bind(this));
        this.addHandler(SFSEvent.CONNECTION_LOST, this.onConnectionLost.bind(this));
        this.addHandler(SFSEvent.LOGIN, this.onLogin.bind(this));
        this.addHandler(SFSEvent.LOGIN_ERROR, this.onLoginError.bind(this));
        this.addHandler(SFSEvent.USER_VARIABLES_UPDATE, this.onUserVariablesUpdate.bind(this));
        this.addHandler(SFSEvent.ROOM_JOIN, this.onRoomJoin.bind(this));
        this.addHandler(SFSEvent.ROOM_JOIN_ERROR, this.onRoomJoinError.bind(this));
        this.addHandler(SFSEvent.PING_PONG, this.onPingPong.bind(this));
        this.addHandler(SFSEvent.EXTENSION_RESPONSE, this.onExtensionResponse.bind(this));
    }

    private addHandler(eventType: string, handler: (e: any) => void) {
        this._sfs.addEventListener(eventType, e => handler(e), this);
    }

    private getDirectionId(value: string): number {
        switch (value) {
            case 'up':
                return 1;
            case 'left':
                return 4;
            case 'right':
                return 2;
            case 'down':
            default:
                return 3;
        }
    }

    private getNextPosition(direction: string, amount?: number): Position {
        const position = {
            x: this._session.player.position.x,
            y: this._session.player.position.y
        };

        switch (direction) {
            case 'up':
                position.y -= amount || 1;
                break;

            case 'left':
                position.x -= amount || 1;
                break;

            case 'right':
                position.x += amount || 1;
                break;

            case 'down':
                position.y += amount || 1;
                break;
        }

        return position;
    }

    private updateUserVariables(user: SFSUser, changedVars: string[] = []) {
        const vars = user.getVariables();

        for (let i = 0; i < vars.length; ++i) {
            if (changedVars.length !== 0 && changedVars.indexOf(vars[i].name) === -1) continue;

            const newValue = vars[i].value;

            switch (vars[i].name) {
                case 'tx':
                    this._session.player.position.x = newValue;
                    break;

                case 'ty':
                    this._session.player.position.y = newValue;
                    break;

                case 'tz':
                    this._session.player.position.z = newValue;
                    break;

                case 'mp':
                    this._session.map.id = newValue;
                    this._session.map.name = ConfigService.retrieveMap(newValue)?.name || '';
                    break;

                // TODO: much more, but for now it's fine
            }

            if (this.player?.destinationPositions && this.player?.position.x === this.player?.destinationPositions.x && this.player?.position.y === this.player?.destinationPositions.y) {
                this._session.player!.isMoving = false
            }
        }
    }

    /**
     * Handlers
     */
    private onExtensionResponse(e: ExtensionResponseEvent) {
        if (e.cmd === EXTENSION_FUNCTIONS.CHANGE_MAP) return this.onMapChange(parseMapChangeEvent(e));
        if (e.cmd === EXTENSION_FUNCTIONS.MOVE) return this.onMove(parseMoveEvent(e));
        if (e.cmd === EXTENSION_FUNCTIONS.UPDATE_BATTLE_QUEUE_RATING) return this.onUpdateBattleQueueRatingEvent(parseUpdateBattleQueueRatingEvent(e));
        if (e.cmd === EXTENSION_FUNCTIONS.BATTLE_INIT) return this.onBattleInitEvent(parseBattleInitEvent(e));
        if (e.cmd === EXTENSION_FUNCTIONS.BATTLE_ROOM_READY) return this.onBattleRoomReadyEvent(parseBattleRoomReadyEvent(e));
        if (e.cmd === EXTENSION_FUNCTIONS.BATTLE_SIM_REQUEST) return this.onBattleSimRequestEvent(parseBattleSimRequestEvent(e));
        if (e.cmd === EXTENSION_FUNCTIONS.BATTLE_UPDATE) return this.onBattleUpdateEvent(parseBattleUpdateEvent(e));
        if (e.cmd === EXTENSION_FUNCTIONS.GLOBAL_MESSAGE) return this.onGlobalMessageEvent(parseGlobalMessageEvent(e));
        if (e.cmd === EXTENSION_FUNCTIONS.LOCAL_MESSAGE) return this.onLocalMessageEvent(parseLocalMessageEvent(e));
        if (e.cmd === EXTENSION_FUNCTIONS.ACHIEVEMENTS) return this.onAchievementsEvent(parseAchievementsEvent(e));
        if (e.cmd === EXTENSION_FUNCTIONS.CALL_U_I) return this.onCall_U_I_Event(parseCall_U_I_Event(e));
        if (e.cmd === EXTENSION_FUNCTIONS.BATTLE_END) return this.onBattleEndEvent(parseBattleEndEvent(e));
        if (e.cmd === EXTENSION_FUNCTIONS.POKEMONS_AFTER_BATTLE_UPDATE) return this.onPokemonAfterBattleUpdateEvent(parsePokemonsAfterBattleEvent(e));
        if (e.cmd === EXTENSION_FUNCTIONS.BOXES_UPDATE) return this.onBoxesUpdateEvent(parseBoxesUpdateEvent(e));
        if (e.cmd === EXTENSION_FUNCTIONS.PLAYER_DATA_UPDATE) return this.onPlayerDataUpdateEvent(parsePlayerDataUpdateEvent(e));
        if (e.cmd === EXTENSION_FUNCTIONS.WORLD_BLESSING) return this.onWorldBlessingEvent(parseWorldBlessingEvent(e));

        Logger.logWarn(`Unhandled extension response: ${e.cmd}`, e);
    }

    private onWorldBlessingEvent(e: WorldBlessingEvent) {
        Logger.logInfo(`World blessing by ${e.player}`, e);
    }


    private onPlayerDataUpdateEvent(e: PlayerDataUpdateEvent) {
        Logger.logInfo('Player data updated', e);
    }

    private onBoxesUpdateEvent(e: BoxesUpdateEvent) {
        Logger.logInfo(`Boxes updated! ${e.pokemonBox.length} item(s) in pokemon box. ${e.itemBox.length} item(s) in item box. ${e.currencyBox.length} item(s) in currency box.`);
    }

    private onPokemonAfterBattleUpdateEvent(e: PokemonsAfterBattleUpdateEvent) {
        Logger.logInfo(`Pokemons after battle update: ${e.pokemons.map(p => p.name).join(', ')}`, e);
    }

    private onBattleEndEvent(e: BattleEndEvent) {
        const msg = !e.tie ? ` Winner: ${e.isWinnerYou ? 'You' : `Opponent (${e.winner})`}` : "It's a tie!";
        Logger.logInfo(`Battle ended. ${msg}`, e);

    }

    private onCall_U_I_Event(e: Call_U_I_Event) {
        Logger.logInfo(`Received call_U_I_Event`, e);
    }

    private onAchievementsEvent(e: AchievementsEvent) {
        Logger.logInfo(`Received achievements`, e);
    }

    private onLocalMessageEvent(e: LocalMessgeEvent) {
        Logger.logInfo(`Local message: ${e.message}`, e);
    }

    private onGlobalMessageEvent(e: GlobalMessageEvent) {
        Logger.logInfo(`Global message: ${e.message}`, e);
    }

    private onBattleUpdateEvent(e: BattleUpdateEvent) {
        Logger.logInfo('Battle update', e);
    }

    private onBattleSimRequestEvent(e: BattleSimRequestEvent) {
        Logger.logInfo(`Received battle sim request`, e);
    }

    private onBattleRoomReadyEvent(e: BattleRoomReadyEvent) {
        Logger.logInfo(`Battle room ready: ${e.room.name}`, e);
    }

    private onBattleInitEvent(e: BattleInitEvent) {
        Logger.logInfo(`Battle started`, e);
    }

    private onUpdateBattleQueueRatingEvent(e: UpdateBattleQueueRatingEvent) {
        Logger.logInfo('Received battle queue rating', e);
    }

    private onMove(e: MoveEvent) {
        Logger.logInfo('Player moved', e);
    }

    private onMapChange(e: MapChangeEvent) {
        Logger.logInfo(`Map changed: ${undefined || 'Unknown name'} (${e.id})`);
    }

    private onPingPong(e: PingPongEvent) {
        this._session.serverInfo.lastLagValue = e.lagValue;
    }

    private onRoomJoinError(e: RoomJoinErrorEvent) {
        Logger.logError(`Room join error: ${e.errorMessage} (${e.errorCode})`);
    }


    private onRoomJoin(e: RoomJoinEvent) {
        Logger.logInfo(`Room joined: ${e.room.name} (${e.room.groupId})`)

        this._session.rooms.push({
            name: e.room.name,
            group: e.room.groupId,
            isGame: e.room.groupId === 'default',
            isBattle: e.room.groupId === 'encounter',
            isChat: e.room.groupId === 'chat',
            ref: e.room
        });
    }

    private onUserVariablesUpdate(e: UserVariablesUpdateEvent) {
        // TODO: store other players data aswell
        if (e.user.name !== this._session.player.username) return;

        Logger.logInfo(`${e.changedVars.length} user variables updated`);

        this._session.player.ref = e.user;

        this.updateUserVariables(e.user, e.changedVars);
    }

    private onLoginError(e: LoginErrorEvent) {
        Logger.logError(`Login error: ${!!e.errorMessage ? e.errorMessage : getLoginErrorMessage(e.errorCode)} (${e.errorCode})`);

        this._session.isLoggedIn = false;
    }

    private onLogin(e: LoginEvent) {
        Logger.logSuccess('Login successful');

        this._session.isLoggedIn = true;
        this._session.player.ref = e.user;
        this.updateUserVariables(e.user, []);
        this._sfs.enableLagMonitor(true);
    }

    private onConnection(e: ConnectionEvent) {
        if (!e.success) {
            Logger.logError('Connection failed', e);
            return;
        }

        this._session.isConnected = true;
    }

    private onConnectionLost(e: ConnectionLostEvent) {
        Logger.logWarn(`Connection lost: ${e.reason}`);

        this._session.isLoggedIn = false;
        this._session.isConnected = false;
    }
}

export const GameService = new GameServiceImpl(false);
