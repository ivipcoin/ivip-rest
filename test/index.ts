import fetch, { Client, Server } from "../src";

new Client({
	protocol: "https",
	host: "api.ipify.org",
	path: "?format=json",
});

fetch("/").then(console.log).catch(console.log);
