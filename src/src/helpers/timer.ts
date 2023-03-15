import { Logger } from "../services/logger.service";

export function sleep(timeout: number) {
	return new Promise(resolve => setTimeout(resolve, timeout));
}

export function wait(stopWaitingFn: () => boolean, timeout: number = 0): Promise<boolean> {
	return new Promise((resolve) => {
		let counter = 0;
		let interval = setInterval(() => {
			if ((counter / 1000) > timeout) {
				clearInterval(interval);
				return resolve(false);
			}

			if (stopWaitingFn()) {
				clearInterval(interval);
				return resolve(true);
			}

			counter += 50
		}, 50);
	});
}

export function waitForAnswer(fn: () => void, answerFn: () => boolean, errorMessage: string, timeout: number = 0): Promise<boolean> {
	return new Promise((resolve) => {
		fn();

		let counter = 0;
		let interval = setInterval(() => {
			if ((counter / 1000) > timeout) {
				Logger.logError(errorMessage);
				clearInterval(interval);
				return resolve(false);
			}

			if (answerFn()) {
				clearInterval(interval);
				return resolve(true);
			}

			counter += 50
		}, 50);
	});
}