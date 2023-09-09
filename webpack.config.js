const path = require("path");

module.exports = {
	entry: "./dist/cjs/index.browser.js", // Seu arquivo de entrada
	output: {
		filename: "browser.js", // Nome do arquivo de saída
		path: path.resolve(__dirname, "dist"), // Diretório de saída
		library: "ivipRest", // Especifique o nome da biblioteca UMD
		libraryTarget: "umd", // Gere no formato UMD
		globalObject: "this", // Evita problemas de referência global no navegador
	},
	mode: "production", // Altere para 'production'
	target: "web", // Plataforma alvo é o navegador
};
