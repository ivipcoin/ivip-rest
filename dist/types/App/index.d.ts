import type { IvipRestApp, IvipRestAppConfig } from "../types/app";
/**
 * Nome padrão para a entrada de cliente "default".
 */
export declare const DEFAULT_ENTRY_NAME = "[DEFAULT]";
/**
 * Configurações da instância IvipRest.
 */
export declare class IvipRestSettings implements IvipRestAppConfig {
    /**
     * Nome da instância IvipRest.
     */
    name: string;
    /**
     * Tipo da instância IvipRest, que pode ser "server" ou "client".
     */
    type: "server" | "client";
    /**
     * Cria uma nova instância de configurações IvipRest.
     * @param options - Opções de configuração.
     */
    constructor(options: Partial<IvipRestSettings>);
}
/**
 * Implementação da instância IvipRest.
 */
export declare class IvipRestAppImpl<App = any, Settings = IvipRestAppConfig> implements IvipRestApp<App> {
    /**
     * Aplicação associada a esta instância IvipRest.
     */
    readonly app: App;
    private readonly _config;
    private readonly _options;
    private _isDeleted;
    /**
     * Cria uma nova instância IvipRest.
     * @param app - Aplicação associada.
     * @param config - Configurações da instância.
     * @param options - Opções da instância IvipRest.
     */
    constructor(app: App, config: Settings, options: IvipRestSettings);
    /**
     * Obtém o nome da instância IvipRest.
     */
    get name(): string;
    /**
     * Obtém as opções da instância IvipRest.
     */
    get options(): IvipRestSettings;
    /**
     * Obtém as configurações da instância IvipRest.
     */
    get config(): Settings;
    /**
     * Verifica se a instância IvipRest foi excluída.
     */
    get isDeleted(): boolean;
    /**
     * Define se a instância IvipRest foi excluída.
     * @param val - Valor a ser definido.
     */
    set isDeleted(val: boolean);
    /**
     * Verifica se a instância IvipRest foi destruída e lança um erro se for verdadeiro.
     */
    private checkDestroyed;
}
/**
 * Inicializa uma nova instância IvipRest.
 * @param app - Aplicação associada.
 * @param config - Configurações da instância IvipRest.
 * @returns A instância IvipRest inicializada.
 */
export declare function initializeApp<App = any, Settings = IvipRestAppConfig>(app: App, config?: Partial<Settings>): IvipRestAppImpl<App, Settings>;
/**
 * Verifica se uma instância IvipRest com o nome especificado existe.
 * @param name - Nome da instância a ser verificada.
 * @returns `true` se a instância existir, `false` caso contrário.
 */
export declare function appExists(name?: string): boolean;
/**
 * Obtém uma instância IvipRest pelo nome.
 * @param name - Nome da instância a ser obtida.
 * @returns A instância IvipRest associada ao nome especificado.
 */
export declare function getApp(name?: string): IvipRestApp;
/**
 * Obtém todas as instâncias IvipRest.
 * @returns Um array contendo todas as instâncias IvipRest disponíveis.
 */
export declare function getApps(): IvipRestApp[];
/**
 * Obtém a primeira instância IvipRest encontrada.
 * @returns A primeira instância IvipRest disponível.
 */
export declare function getFirstApp(): IvipRestApp;
/**
 * Exclui uma instância IvipRest.
 * @param app - A instância IvipRest a ser excluída.
 */
export declare function deleteApp(app: IvipRestAppImpl): void;
//# sourceMappingURL=index.d.ts.map