import { ExtensionResponseEvent } from "./ExtensionResponseEvent";

export interface LocalMessgeEvent {
	fc: number;
	message: string;
}

export function parseLocalMessageEvent(e: ExtensionResponseEvent): LocalMessgeEvent {
	return {
		fc: e.params.get('fc'),
		message: e.params.get('m')
	}
}