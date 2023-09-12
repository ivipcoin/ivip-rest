import { Request } from "express";
import { FunctionRoute, FunctionRouteUtils, RequiresAccess } from "../types/server";
import { getCacheBy, hasCacheBy, pushCacheBy } from "./internal";

export class RouteComponentSettings {
	public path: string = "/";
	public method: "all" | "get" | "put" | "delete" | string[] = "all";
	public requiresAccess: RequiresAccess | null = null;
	public serverOnlyRequest: boolean = false;
	public onlyAuthorizedRequest: boolean = false;
	public lifetime: number = 0;
	public cacheByUser: boolean = true;
	public cacheByRequest: string[] = [];

	constructor(options: Partial<RouteComponentSettings>) {
		if (typeof options !== "object") {
			return;
		}

		this.assign(options);
	}

	assign(...options: Array<Partial<RouteComponentSettings>>) {
		for (let config of options) {
			if (typeof config !== "object") {
				continue;
			}

			this.path = typeof config.path === "string" ? config.path : this.path;

			this.method = typeof config.method === "string" ? config.method : Array.isArray(config.method) ? config.method.filter((m) => typeof m === "string") : this.method;

			this.requiresAccess =
				config.requiresAccess && typeof config.requiresAccess === "object" && typeof config.requiresAccess.user === "string" && typeof config.requiresAccess.password === "string"
					? config.requiresAccess
					: this.requiresAccess;

			this.serverOnlyRequest = typeof config.serverOnlyRequest === "boolean" ? config.serverOnlyRequest : this.serverOnlyRequest;

			this.onlyAuthorizedRequest = typeof config.onlyAuthorizedRequest === "boolean" ? config.onlyAuthorizedRequest : this.onlyAuthorizedRequest;

			this.lifetime = typeof config.lifetime === "number" ? config.lifetime : this.lifetime;

			this.cacheByUser = typeof config.cacheByUser === "boolean" ? config.cacheByUser : this.cacheByUser;

			this.cacheByRequest = Array.isArray(config.cacheByRequest) ? config.cacheByRequest.filter((s) => typeof s === "string") : this.cacheByRequest;
		}
	}
}

export default class RouteComponent<RouteResources = any> {
	public request: object = {};
	public body: object = {};
	public params: object = {};
	public query: object = {};
	public headers: object = {};
	public dispatch: (path: string, body?: object) => any | Promise<any> = () => {};

	readonly config: RouteComponentSettings;

	constructor(config: Partial<RouteComponentSettings>) {
		this.request = {};
		this.body = {};
		this.params = {};
		this.query = {};
		this.headers = {};
		this.dispatch = () => {};

		this.config = new RouteComponentSettings(config);
	}

	unauthorizedRequest(type: number) {
		switch (type) {
			case 0:
				throw "No access permission!";
			case 1:
				throw "Only internal requests are authorized to access this channel!";
			case 2:
				throw "The request method for a specific route does not exist!";
			default:
				throw "The request could not be made!";
		}
	}

	public render: FunctionRoute<RouteResources> | FunctionRoute<RouteResources>[] = () => {
		return Promise.resolve(null);
	};

	public all: FunctionRoute<RouteResources> | FunctionRoute<RouteResources>[] = () => {
		return Promise.resolve(null);
	};

	public get: FunctionRoute<RouteResources> | FunctionRoute<RouteResources>[] = () => {
		return Promise.resolve(null);
	};

	public post: FunctionRoute<RouteResources> | FunctionRoute<RouteResources>[] = () => {
		return Promise.resolve(null);
	};

	public put: FunctionRoute<RouteResources> | FunctionRoute<RouteResources>[] = () => {
		return Promise.resolve(null);
	};

	public delete: FunctionRoute<RouteResources> | FunctionRoute<RouteResources>[] = () => {
		return Promise.resolve(null);
	};

	static apply<RouteResources = any>(config: Partial<RouteComponentSettings>, ...fn: FunctionRoute<RouteResources>[]) {
		const component = new RouteComponent<RouteResources>(config);
		const { method } = component.config;

		const methods = Array.isArray(method) ? method : typeof method === "string" ? [method] : [];

		for (let method of methods) {
			if (method in config && typeof (config as any)[method] === "function") {
				(component as any)[method] = (config as any)[method];
			} else if (fn.findIndex((fn) => typeof fn === "function") >= 0) {
				(component as any)[method] = fn.filter((fn) => typeof fn === "function");
			}
		}

		return component;
	}

	__render_component__(request: Request, resources: FunctionRouteUtils & RouteResources) {
		return new Promise(async (resolve, reject) => {
			try {
				let results: any[] = [],
					cache_id: string | null = null;

				const { lifetime, cacheByRequest, cacheByUser, method, requiresAccess, serverOnlyRequest, onlyAuthorizedRequest } = this.config;

				const { params, query, body, headers } = request;

				if (lifetime > 0) {
					const [baseUrl, queryParams] = request.url.split("?");

					cache_id = `${baseUrl}?${JSON.stringify(
						Object.assign(
							Object.fromEntries(
								cacheByRequest.map((key) => {
									return [key, key in params ? params[key] : key in query ? query[key] : key in body ? body[key] : null];
								}),
							),
							{
								userId: cacheByUser ? request.ip : null,
							},
						),
					)}`;

					if (hasCacheBy([cache_id])) {
						return resolve(getCacheBy([cache_id]));
					}
				}

				if (Array.isArray(method) && method.map((m) => String(m).toLowerCase()).includes(String(request.method).toLowerCase()) !== true) {
					return this.unauthorizedRequest(2);
				}

				if (String(method).toLowerCase() !== "all" && String(method).toLowerCase() !== String(request.method).toLowerCase()) {
					return this.unauthorizedRequest(2);
				}

				const isRequiresAccess = requiresAccess && typeof requiresAccess.user === "string" && typeof requiresAccess.password === "string";

				if (serverOnlyRequest && !(request as any).serverRequest && !isRequiresAccess) {
					return this.unauthorizedRequest(1);
				}

				if (!(serverOnlyRequest && (request as any).serverRequest) && isRequiresAccess) {
					const proceed = await resources
						.requiresAccess([
							{
								user: requiresAccess?.user ?? "",
								password: requiresAccess?.password ?? "",
							},
						])
						.then(() => Promise.resolve(true))
						.catch(() => Promise.resolve(false));

					if (!proceed) {
						return null;
					}
				}

				if (onlyAuthorizedRequest && resources && typeof resources.checkAuthorization === "function") {
					if (!(request as any)["approvedRequest"] && !(request as any)["requiredAuthorization"]) {
						try {
							(request as any)["approvedRequest"] = await resources.checkAuthorization(request as any).catch(() => Promise.resolve(false));
						} catch {
							(request as any)["approvedRequest"] = false;
						}

						(request as any)["requiredAuthorization"] = true;
					}

					if (!(request as any)["approvedRequest"]) {
						return this.unauthorizedRequest(0);
					}
				}

				const thisMethod = String(method).toLowerCase();

				let operationsRoute =
					thisMethod === "all"
						? this.all
						: thisMethod === "get"
						? this.get
						: thisMethod === "post"
						? this.post
						: thisMethod === "put"
						? this.put
						: thisMethod === "delete"
						? this.delete
						: this.all;

				operationsRoute = Array.isArray(operationsRoute) ? operationsRoute : [operationsRoute];

				const next = async (request: Request, resources: FunctionRouteUtils & RouteResources, index = 0) => {
					const fn = (operationsRoute as any)[index];

					return await fn.apply({ ...this, request, body, params, query, headers, dispatch: resources.dispatch }, [
						Object.assign(request, { body, params, query, headers }),
						resources,
						async () => {
							results.push(await next(request, resources, index + 1));
						},
					] as any);
				};

				results.push(await next(request, resources, 0));

				const result = results.find((r) => r !== null) ?? undefined;

				try {
					if (lifetime > 0 && ["object", "boolean", "number", "bigint", "string"].includes(typeof result) && typeof cache_id === "string") {
						pushCacheBy([cache_id], result, lifetime);
					}
				} catch {}

				return resolve(result);
			} catch (e) {
				reject(e);
			}
		});
	}
}
