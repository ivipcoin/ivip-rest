import type { IvipRestApp, IvipRestAppConfig } from "../types/app";
export declare const DEFAULT_ENTRY_NAME = "[DEFAULT]";
export declare class IvipRestSettings implements IvipRestAppConfig {
    name: string;
    type: "server" | "client";
    constructor(options: Partial<IvipRestSettings>);
}
export declare class IvipRestAppImpl<App = any, Settings = IvipRestAppConfig> implements IvipRestApp<App> {
    readonly app: App;
    private readonly _config;
    private readonly _options;
    private _isDeleted;
    constructor(app: App, config: Settings, options: IvipRestSettings);
    get name(): string;
    get options(): IvipRestSettings;
    get config(): Settings;
    get isDeleted(): boolean;
    set isDeleted(val: boolean);
    private checkDestroyed;
}
export declare function initializeApp<App = any, Settings = IvipRestAppConfig>(app: App, config?: Partial<Settings>): IvipRestAppImpl<App, Settings>;
export declare function appExists(name?: string): boolean;
export declare function getApp(name?: string): IvipRestApp;
export declare function getApps(): IvipRestApp[];
export declare function getFirstApp(): IvipRestApp;
export declare function deleteApp(app: IvipRestAppImpl): void;
//# sourceMappingURL=index.d.ts.map