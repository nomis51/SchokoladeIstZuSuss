export interface Config {
	serverInfo: {
		host: string;
		port: number;
		useSsl: boolean;
		zone: string;
		rs: boolean;
		version: string;
	};
	userInfo: {
		username: string;
		hashedPassword: string;
		id: number;
	};
	maxConnectionWaitingTime: number;
	maxLoginWaitingTime: number;
}