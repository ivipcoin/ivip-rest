import type { IvipRestApp, IvipRestAppConfig } from "../types/app";
import { _apps } from "./internal";

import { deepEqual } from "ivip-utils";

export const DEFAULT_ENTRY_NAME = "[DEFAULT]";

export class IvipRestSettings implements IvipRestAppConfig {
	name: string = DEFAULT_ENTRY_NAME;
	type: "server" | "client" = "client";

	constructor(options: Partial<IvipRestSettings>) {
		if (typeof options !== "object") {
			options = {};
		}
		if (typeof options.name === "string") {
			this.name = options.name;
		}
		if (typeof options.type === "string" && ["server", "client"].includes(options.type)) {
			this.type = options.type;
		}
	}
}

export class IvipRestAppImpl<App = any, Settings = IvipRestAppConfig> implements IvipRestApp<App> {
	private readonly _config: Settings;
	private readonly _options: IvipRestSettings;
	private _isDeleted = false;

	constructor(readonly app: App, config: Settings, options: IvipRestSettings) {
		this._config = config;
		this._options = options;
	}

	get name(): string {
		this.checkDestroyed();
		return this._options.name;
	}

	get options(): IvipRestSettings {
		this.checkDestroyed();
		return this._options;
	}

	get config(): Settings {
		this.checkDestroyed();
		return this._config;
	}

	get isDeleted(): boolean {
		return this._isDeleted;
	}

	set isDeleted(val: boolean) {
		this._isDeleted = val;
	}

	private checkDestroyed(): void {
		if (this.isDeleted) {
			//throw ERROR_FACTORY.create(AppError.APP_DELETED, { appName: this._name });
			throw "";
		}
	}
}

export function initializeApp<App = any, Settings = IvipRestAppConfig>(app: App, config: Partial<Settings> = {}): IvipRestAppImpl<App, Settings> {
	const options: IvipRestSettings = new IvipRestSettings(config);

	const name = options.name;

	if (typeof name !== "string" || !name) {
		// throw ERROR_FACTORY.create(AppError.BAD_APP_NAME, {
		//     appName: String(name)
		// });
		throw "";
	}

	const existingApp = _apps.get(name) as IvipRestAppImpl<App, Settings>;
	if (existingApp) {
		// return the existing app if options and config deep equal the ones in the existing app.
		if (deepEqual(options, existingApp.options) && deepEqual(config, (existingApp.config as any) ?? {})) {
			return existingApp;
		} else {
			//throw ERROR_FACTORY.create(AppError.DUPLICATE_APP, { appName: name });
			throw "";
		}
	}

	const newApp = new IvipRestAppImpl<App, Settings>(app, config as Settings, options);

	_apps.set(name, newApp);

	return newApp;
}

export function appExists(name?: string): boolean {
	return typeof name === "string" && _apps.has(name);
}

export function getApp(name: string = DEFAULT_ENTRY_NAME): IvipRestApp {
	const { app } = _apps.get(name) ?? {};
	if (!app) {
		//throw ERROR_FACTORY.create(AppError.NO_APP, { appName: name });
		throw "";
	}
	return app;
}

export function getApps(): IvipRestApp[] {
	return Array.from(_apps.values());
}

export function getFirstApp(): IvipRestApp {
	const { app } = getApps()[0];
	if (!app) {
		//throw ERROR_FACTORY.create(AppError.NO_APP, { appName: name });
		throw "";
	}
	return app;
}

export function deleteApp(app: IvipRestAppImpl) {
	const name = app.name;
	if (_apps.has(name)) {
		_apps.delete(name);
		(app as IvipRestAppImpl).isDeleted = true;
	}
}
