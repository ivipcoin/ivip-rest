export interface IvipRestAppConfig {
    readonly name: string;
    readonly type: "server" | "client";
}
export interface IvipRestApp<App = any> {
    readonly name: string;
    readonly options: IvipRestAppConfig;
    readonly config: any;
    readonly isDeleted: boolean;
    readonly app: App;
}
//# sourceMappingURL=app.d.ts.map