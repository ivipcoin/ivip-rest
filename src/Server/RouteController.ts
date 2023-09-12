import express, { Express, Request, Router } from "express";
import path from "path";
import fs from "fs";
// @ts-ignore
import { fileTypeFromBuffer } from "file-type";
import requestIp from "request-ip";
import chokidar from "chokidar";
import isGlob from "is-glob";
import globParent from "glob-parent";

import RouteComponent from "./RouteComponent";
import { FunctionRouteUtils } from "../types/server";
import Result from "./Result";
import { isBuffer } from "ivip-utils";

const myArgs = process.argv.slice(2);
const isDev = myArgs.includes("dev");

const validatePaths = (paths: string | string[]): string[] => {
	paths = Array.isArray(paths) ? paths : [paths];
	return paths.filter((path) => {
		return typeof path === "string" && (isGlob(path) || fs.existsSync(path));
	});
};

const renderPath = (pathRoot: string, pathMain: string) =>
	("/" + path.join(pathRoot, pathMain.indexOf("index") < 0 ? pathMain : "").replace(/([\\]+)/gi, "/")).replace(/^(\/+)/gi, "/").replace(/(\/+)$/gi, "");

const prepareRoutes = (pathRoot: string, obj: Function | RouteComponent | object | Array<Function | RouteComponent>, routes: any) => {
	if (obj instanceof RouteComponent) {
		let p = renderPath(pathRoot, obj.config.path);
		routes[p] = obj;
	} else if (typeof obj === "function") {
		prepareRoutes(pathRoot, RouteComponent.apply({ path: "/", method: "all" }, obj as any), routes);
	} else if (Array.isArray(obj)) {
		for (let component of obj) {
			if (typeof component !== "function") {
				prepareRoutes(pathRoot, component, routes);
			}
		}
	} else if (typeof obj === "object") {
		for (let key in obj) {
			prepareRoutes(renderPath(pathRoot, key), (obj as any)[key], routes);
		}
	}
};

const findModulesImporting = async (filePathToFind: string, limitPath: string | string[], visited = new Set()) => {
	const importingModules: string[] = [];
	try {
		async function isDescendant(childPath: string, parentPath: string | string[]) {
			const path = await import("path");

			parentPath = Array.isArray(parentPath) ? parentPath : [parentPath];

			for (let parent of parentPath) {
				const relativePath = path.relative(parent, childPath);
				if (!relativePath.startsWith("..") && !path.isAbsolute(relativePath)) {
					return true;
				}
			}

			return false;
		}

		let resolveFilePathToFind: string | undefined;

		try {
			resolveFilePathToFind = module.require.resolve(filePathToFind) ?? undefined;
		} catch {
			resolveFilePathToFind = undefined;
		}

		if (!resolveFilePathToFind || visited.has(resolveFilePathToFind) || !isDescendant(resolveFilePathToFind, limitPath)) {
			return importingModules;
		}

		visited.add(resolveFilePathToFind);

		const nodes: Array<[string, string[]]> = Object.entries(module.require.cache).map(([path, node]) => {
			return [path, (node?.children ?? []).map(({ filename }) => filename)];
		});

		for (let [path, children] of nodes) {
			if (children.includes(resolveFilePathToFind) && (await isDescendant(path, limitPath))) {
				const childImportingModules = await findModulesImporting(path, limitPath, visited);
				importingModules.push(path);

				if (childImportingModules.length > 0) {
					importingModules.push(...childImportingModules);
				}
			}
		}
	} catch {}

	return importingModules.filter((p, i, l) => l.indexOf(p) === i);
};

export class RouteControllerSettings<RouteResources = any> {
	readonly app: Express | undefined;

	readonly routesPath: string = "";

	readonly pathSearchRoutes: string = "";

	readonly resources: FunctionRouteUtils & RouteResources = {} as any;

	readonly watch: string[] = [];

	readonly preRequestHook: (req: Request) => Promise<void> = (req: Request) => Promise.resolve();

	constructor(options: Partial<RouteControllerSettings>) {
		if (typeof options !== "object") {
			options = {};
		}

		if (typeof options.routesPath === "string") {
			this.routesPath = options.routesPath.replace(/\\/g, "/");
			this.pathSearchRoutes = path.join(this.routesPath, "./**/index.{js,ts}").replace(/\\/g, "/");
		}

		if (options.app instanceof express) {
			this.app = options.app;
		}

		if (typeof options.resources === "object") {
			this.resources = options.resources;
		}

		if (Array.isArray(options.watch)) {
			this.watch = options.watch.filter((p) => typeof p === "string");
		}

		if (typeof options.preRequestHook === "function") {
			this.preRequestHook = options.preRequestHook;
		}
	}
}

export default class RouteController<RouteResources = any> {
	readonly router: Router;
	private rootRoutes = {};
	private config: RouteControllerSettings;
	private cacheFileRoutes: { [file: string]: any } = {};

	constructor(config: Partial<Omit<RouteControllerSettings, "pathSearchRoutes">>) {
		this.router = express.Router();
		this.config = new RouteControllerSettings<RouteResources>(config);

		chokidar
			.watch(this.config.pathSearchRoutes)
			.on("add", (file) => {
				this.requireFileAndLoad(file);
			})
			.on("change", (file) => {
				console.log(`O arquivo ${file} foi modificado!`);
				this.requireFileAndLoad(file);
			});

		const importWatch = validatePaths(this.config.watch);

		for (let importWatchPath of importWatch) {
			chokidar
				.watch(importWatchPath)
				.on("add", (file) => {
					this.updateAllRoutes(
						file,
						importWatch.map((p) => globParent(p)),
					);
				})
				.on("change", (file) => {
					console.log(`O arquivo ${file} foi modificado!`);
					this.updateAllRoutes(
						file,
						importWatch.map((p) => globParent(p)),
					);
				});
		}

		this.config.app?.use("/", this.router);
	}

	reposicionarRota(posicaoAtual: number, posicaoDesejada: number) {
		if (posicaoAtual === posicaoDesejada || posicaoAtual < 0 || posicaoAtual >= this.router.stack.length || posicaoDesejada < 0 || posicaoDesejada >= this.router.stack.length) {
			return;
		}
		const rota = this.router.stack.splice(posicaoAtual, 1)[0];
		this.router.stack.splice(posicaoDesejada, 0, rota);
	}

	updateOrder() {
		const listaAtual: string[] = this.router.stack.map((middleware) => {
			return middleware.route && typeof middleware.route.path === "string" ? middleware.route.path : "";
		});

		let listaDesejada: string[] = Array.from(listaAtual);

		const paramRoutes = listaDesejada
			.filter((route: string) => (route as any).includes(":"))
			.sort((a: string, b: string) => {
				const aParams = a.match(/\//g)?.length ?? 0;
				const bParams = b.match(/\//g)?.length ?? 0;
				return bParams - aParams;
			});

		const alphaRoutes = listaDesejada.filter((route) => !route.includes(":")).sort();

		listaDesejada = Array.prototype.concat.apply([], [alphaRoutes, paramRoutes]);

		listaAtual.forEach((pathAtual) => {
			const posicaoAtual = this.router.stack.findIndex((rota) => rota.route && rota.route.path === pathAtual);
			const posicaoDesejada = listaDesejada.findIndex((path) => path === pathAtual);
			this.reposicionarRota(posicaoAtual, posicaoDesejada);
		});
	}

	appendRoute(route: string, routeComponent: Function | RouteComponent) {
		(this.rootRoutes as any)[route] = routeComponent;

		this.router.all(route, async (req, res, next) => {
			await this.config.preRequestHook(req);

			(req as any)["requestIp"] = requestIp.getClientIp(req);

			(req as any)["serverRequest"] = isDev;
			(req as any)["dispatched"] = false;

			(req.params["clientIp"] as any) = undefined;
			req.query["clientIp"] = undefined;
			req.body["clientIp"] = undefined;
			req.headers["clientIp"] = undefined;

			let request = {
				...req.body,
				...req.params,
				...req.query,
				...req.headers,
				...req.socket,
				...req,
				body: req.body,
				params: req.params,
				query: req.query,
				headers: req.headers,
				approvedRequest: false,
			};

			request["fullUrl"] = `${String(process.env.DOMAIN).replace(/(\/+)$/gi, "")}/${String(request["originalUrl"]).replace(/^(\/+)/gi, "")}`;

			const propsDispatch = { routes: this.rootRoutes, request, response_http: res };

			this.config.resources.dispatch = () => {};
			this.config.resources.request = (res: any) => res;
			this.config.resources.requiresAccess = () => true;

			try {
				let result = await (this.rootRoutes as any)[route].__render_component__(request, this.config.resources, next);
				//let result = await dispatch.bind(propsDispatch)(request.route.path);

				if (res.finished) {
					return;
				}

				if (isBuffer(result)) {
					const contentType = await fileTypeFromBuffer(result);

					res.writeHead(200, {
						"Content-type": contentType?.mime,
						"Content-Length": result.length,
					});

					return res.end(result, "binary");
				} else if (result && typeof result.contentType === "string" && (typeof result.content === "string" || isBuffer(result.content))) {
					const content = typeof result.content === "string" ? Buffer.from(result.content) : result.content;

					res.writeHead(200, {
						"Content-type": result.contentType,
						"Content-Length": content.length,
					});

					return res.end(content);
				} else if (result && result.type === "html" && typeof result.content === "string") {
					res.writeHead(200, {
						"Content-type": "text/html",
					});

					return res.end(Buffer.from(result.content));
				} else if (["object", "boolean", "number", "bigint", "string"].includes(typeof result)) {
					return new Result(result, "", 200, res);
				} else {
					return new Result(null, "Algo deu errado!", -1, res);
				}
			} catch (e) {
				console.error(e);
				return new Result(null, String(e), -1, res);
			}
		});
	}

	async requireFileAndLoad(file: string) {
		try {
			let indexPath = file
				.replace(/\\/g, "/")
				.replace(this.config.routesPath, "")
				.replace(/(\/index\.(js|ts))$/gi, "");
			delete module.require.cache[module.require.resolve(file)];
			let import_default = await import(path.resolve(file));

			let routes = {};

			let routesPath = Array.isArray(this.cacheFileRoutes[file]) ? this.cacheFileRoutes[file] : [];

			for (let route of routesPath) {
				const indexRoute = this.router.stack.findIndex((middleware) => {
					return middleware.route && middleware.route.path === route;
				});
				this.router.stack.splice(indexRoute, 1);
				delete (this.rootRoutes as any)[route];
			}

			prepareRoutes(indexPath, Array.isArray(import_default.default) || typeof import_default.default === "object" ? import_default.default : import_default, routes);

			routesPath = Object.keys(routes);

			this.cacheFileRoutes[file] = routesPath;

			for (let route of routesPath) {
				this.appendRoute(route, (routes as any)[route]);
			}

			this.updateOrder();
		} catch {}
	}

	async updateAllRoutes(file: string, limitPath: string | string[]) {
		const paths = await findModulesImporting(file, limitPath);

		delete module.require.cache[module.require.resolve(file)];
		await import(path.resolve(file));

		for (let filePath of paths) {
			try {
				if (fs.existsSync(filePath)) {
					delete module.require.cache[module.require.resolve(filePath)];
					await import(path.resolve(file));
				}
			} catch {}
		}

		for (let routePath in this.cacheFileRoutes) {
			this.requireFileAndLoad(routePath);
		}
	}
}