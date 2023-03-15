import { ExtensionResponseEvent } from "./ExtensionResponseEvent";

export interface AchievementsEvent {
	// TODO: complete fields
}

export function parseAchievementsEvent(e: ExtensionResponseEvent): AchievementsEvent {
	return {} // TODO: use e.params.get('var name') to get values
}