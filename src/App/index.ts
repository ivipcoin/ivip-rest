import type { IvipRestApp, IvipRestAppConfig } from "../types/app";
import { _apps } from "./internal";

import { deepEqual } from "ivip-utils";

/**
 * Nome padrão para a entrada de cliente "default".
 */
export const DEFAULT_ENTRY_NAME = "[DEFAULT]";

/**
 * Configurações da instância IvipRest.
 */
export class IvipRestSettings implements IvipRestAppConfig {
	/**
	 * Nome da instância IvipRest.
	 */
	name: string = DEFAULT_ENTRY_NAME;

	/**
	 * Tipo da instância IvipRest, que pode ser "server" ou "client".
	 */
	type: "server" | "client" = "client";

	/**
	 * Cria uma nova instância de configurações IvipRest.
	 * @param options - Opções de configuração.
	 */
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

/**
 * Implementação da instância IvipRest.
 */
export class IvipRestAppImpl<App = any, Settings = IvipRestAppConfig> implements IvipRestApp<App> {
	/**
	 * Aplicação associada a esta instância IvipRest.
	 */
	readonly app: App;

	private readonly _config: Settings;
	private readonly _options: IvipRestSettings;
	private _isDeleted = false;

	/**
	 * Cria uma nova instância IvipRest.
	 * @param app - Aplicação associada.
	 * @param config - Configurações da instância.
	 * @param options - Opções da instância IvipRest.
	 */
	constructor(app: App, config: Settings, options: IvipRestSettings) {
		this.app = app;
		this._config = config;
		this._options = options;
	}

	/**
	 * Obtém o nome da instância IvipRest.
	 */
	get name(): string {
		this.checkDestroyed();
		return this._options.name;
	}

	/**
	 * Obtém as opções da instância IvipRest.
	 */
	get options(): IvipRestSettings {
		this.checkDestroyed();
		return this._options;
	}

	/**
	 * Obtém as configurações da instância IvipRest.
	 */
	get config(): Settings {
		this.checkDestroyed();
		return this._config;
	}

	/**
	 * Verifica se a instância IvipRest foi excluída.
	 */
	get isDeleted(): boolean {
		return this._isDeleted;
	}

	/**
	 * Define se a instância IvipRest foi excluída.
	 * @param val - Valor a ser definido.
	 */
	set isDeleted(val: boolean) {
		this._isDeleted = val;
	}

	/**
	 * Verifica se a instância IvipRest foi destruída e lança um erro se for verdadeiro.
	 */
	private checkDestroyed(): void {
		if (this.isDeleted) {
			//throw ERROR_FACTORY.create(AppError.APP_DELETED, { appName: this._name });
			throw "";
		}
	}
}

/**
 * Inicializa uma nova instância IvipRest.
 * @param app - Aplicação associada.
 * @param config - Configurações da instância IvipRest.
 * @returns A instância IvipRest inicializada.
 */
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

/**
 * Verifica se uma instância IvipRest com o nome especificado existe.
 * @param name - Nome da instância a ser verificada.
 * @returns `true` se a instância existir, `false` caso contrário.
 */
export function appExists(name?: string): boolean {
	return typeof name === "string" && _apps.has(name);
}

/**
 * Obtém uma instância IvipRest pelo nome.
 * @param name - Nome da instância a ser obtida.
 * @returns A instância IvipRest associada ao nome especificado.
 */
export function getApp(name: string = DEFAULT_ENTRY_NAME): IvipRestApp {
	const { app } = _apps.get(name) ?? {};
	if (!app) {
		//throw ERROR_FACTORY.create(AppError.NO_APP, { appName: name });
		throw "";
	}
	return app;
}

/**
 * Obtém todas as instâncias IvipRest.
 * @returns Um array contendo todas as instâncias IvipRest disponíveis.
 */
export function getApps(): IvipRestApp[] {
	return Array.from(_apps.values());
}

/**
 * Obtém a primeira instância IvipRest encontrada.
 * @returns A primeira instância IvipRest disponível.
 */
export function getFirstApp(): IvipRestApp {
	const { app } = getApps()[0];
	if (!app) {
		//throw ERROR_FACTORY.create(AppError.NO_APP, { appName: name });
		throw "";
	}
	return app;
}

/**
 * Exclui uma instância IvipRest.
 * @param app - A instância IvipRest a ser excluída.
 */
export function deleteApp(app: IvipRestAppImpl) {
	const name = app.name;
	if (_apps.has(name)) {
		_apps.delete(name);
		(app as IvipRestAppImpl).isDeleted = true;
	}
}
