export interface LoginErrorEvent {
    errorCode: number;
    errorMessage: string;
}

export function getLoginErrorMessage(errorCode: number): string {
    return !!ERROR_CODES[errorCode] ? ERROR_CODES[errorCode] : 'Unknown error';
}

const ERROR_CODES: Record<number, string> = {
    113: "Invalid login",
    116: "Server is not available",
    117: "Already logged in somewhere else",
}