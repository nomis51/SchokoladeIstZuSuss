type MessageType = 'info' | 'warn' | 'error' | 'success' | 'normal';

class LoggerServiceImpl {
    /**
     * Public functions
     */
    public logInfo(message: string, data: any | undefined = undefined) {
        this._log(message, 'info', data);
    }

    public logWarn(message: string, data: any | undefined = undefined) {
        this._log(message, 'warn', data);
    }

    public logError(message: string, data: any | undefined = undefined) {
        this._log(message, 'error', data);
    }

    public logSuccess(message: string, data: any | undefined = undefined) {
        this._log(message, 'success', data);
    }

    public log(message: string, data: any | undefined = undefined) {
        this._log(message, 'normal', data);
    }

    /**
     * Private functions
     */
    private _log(message: string, type: MessageType, data: any | undefined = undefined) {
        const args = [`%c[${type.toLocaleUpperCase()}]`, `color: ${this.getTypeColor(type)}`, message];

        if (data !== undefined) {
            args.push(data);
        }

        console.log(...args);
    }

    private getTypeColor(type: MessageType): string {
        switch (type) {
            case 'info':
                return 'cyan';
            case 'warn':
                return 'yellow';
            case 'error':
                return 'orange';
            case 'success':
                return 'lime';
            default:
                return 'initial';

        }
    }
}

export const Logger = new LoggerServiceImpl();