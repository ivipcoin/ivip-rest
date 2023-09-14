import fetch, { Client, Server } from "../src";
import { Express } from "express";

// new Client({
// 	protocol: "https",
// 	host: "api.ipify.org",
// 	path: "?format=json",
// });

// fetch("/").then(console.log).catch(console.log);

import path from "path";

const app = new Server({
	routesPath: path.join(__dirname, "./Routes"),
});

app.ready(async () => {
	await new Promise((resolve) => setTimeout(resolve, 5000));

	let route: any,
		routes: any[] = [];

	try {
		app.app._router.stack.forEach(function (middleware) {
			if (middleware.route) {
				// routes registered directly on the app
				routes.push(middleware.route);
			} else if (middleware.name === "router") {
				// router middleware
				middleware.handle.stack.forEach(function (handler) {
					route = handler.route;
					route && routes.push(route);
				});
			}
		});

		// routes = routes.map((route) => {
		// 	let str = route.path.split("/").map((v) => (/^:[\S]+/gi.test(v) ? `\${${v.replace(":", "")}}` : v));
		// 	route.path = str.join("/");
		// 	return route;
		// });
	} catch {}

	console.log(routes.map((a) => a.path).sort());

	app.fetch("/v1/ismael/params").then(console.log).catch(console.error);
});
