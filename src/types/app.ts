export interface IvipRestAppConfig {
	readonly name: string;
	readonly type: "server" | "client";
}

export interface IvipRestApp {
	readonly name: string;
	readonly options: IvipRestAppConfig;
	readonly config: any;
	readonly isDeleted: boolean;
}
