import fetch, { Client, Server } from "../src";
//import { Client, Server } from "../dist/esm";

new Client({
	protocol: "https",
	host: "api.ipify.org",
	path: "?format=json",
});

// fetch("/").then(console.log).catch(console.log);
