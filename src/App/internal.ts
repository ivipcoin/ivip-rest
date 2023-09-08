import { IvipRestApp } from "../types/app";

/**
 * @internal
 * Uma mapa que armazena instâncias de aplicativos IvipRest.
 * Cada aplicativo é associado a um nome exclusivo.
 *
 * @type {Map<string, IvipRestApp<any>>}
 */
export const _apps = new Map<string, IvipRestApp>();
