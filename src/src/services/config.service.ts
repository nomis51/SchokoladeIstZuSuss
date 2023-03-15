import { Config } from "../models/api/Config";
import { Map as GameMap } from '../models/data/Map';
import { Item } from "../models/data/Item";
import config from '../data/config.json';
import heroHousef2Map from '../data/maps/hero-house-f2.json';
import heroHousef1Map from '../data/maps/hero-house-f1.json';
import palletTownMap from '../data/maps/pallet-town.json';
import professorOaksLabMap from '../data/maps/professor-oaks-lab.json';
import route1Map from '../data/maps/route-1.json';
import items from '../data/items.json';

// TODO: that would be moved and handled by some kind of local backend for persistence. This class is just for playground purpose.

class ConfigServiceImpl {
	/**
	 * Members
	 */
	private readonly _maps: Map<number, GameMap> = new Map();
	private readonly _items: Map<number, Item> = new Map();

	/**
	 * Props
	 */
	public get maps(): GameMap[] {
		return Array.from(this._maps.values());
	}

	public get items(): Item[] {
		return Array.from(this._items.values());
	}

	/**
	 * Constructor
	 */
	constructor() {
		this._maps.set(heroHousef2Map.id, heroHousef2Map);
		this._maps.set(heroHousef1Map.id, heroHousef1Map);
		this._maps.set(palletTownMap.id, palletTownMap);
		this._maps.set(professorOaksLabMap.id, professorOaksLabMap);
		this._maps.set(route1Map.id, route1Map);

		for (const item of items) {
			this._items.set(item.id, item);
		}
	}

	/**
	 * Public functions
	 */
	public retrieveConfig(): Config {
		return config as Config;
	}

	public retrieveMap(mapId: number): GameMap | undefined {
		if (!this._maps.has(mapId)) return;

		return this._maps.get(mapId);
	}

	public retrieveItem(itemId: number): Item | undefined {
		if (!this._items.has(itemId)) return;
		return this._items.get(itemId);
	}
}

export const ConfigService = new ConfigServiceImpl();