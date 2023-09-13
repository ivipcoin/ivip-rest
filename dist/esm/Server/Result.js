let code_list = {
    "200": "OK",
    "201": "Created",
    "202": "Accepted",
    "203": "Non-Authoritative Information",
    "204": "No Content",
    "205": "Reset Content",
    "206": "Partial Content",
    "300": "Multiple Choice",
    "301": "Moved Permanently",
    "302": "Found",
    "303": "See Other",
    "304": "Not Modified",
    "305": "Use Proxy",
    "306": "unused",
    "307": "Temporary Redirect",
    "308": "Permanent Redirect",
    "400": "Bad Request",
    "401": "Unauthorized",
    "402": "Payment Required",
    "403": "Forbidden",
    "404": "Not Found",
    "405": "Method Not Allowed",
    "406": "Not Acceptable",
    "407": "Proxy Authentication Required",
    "408": "Request Timeout",
    "409": "Conflict",
    "410": "Gone",
    "411": "Length Required",
    "412": "Precondition Failed",
    "413": "Payload Too Large",
    "414": "URI Too Long",
    "415": "Unsupported Media Type",
    "416": "Requested Range Not Satisfiable",
    "417": "Expectation Failed",
    "418": "I'm a teapot",
    "421": "Misdirected Request",
    "425": "Too Early",
    "426": "Upgrade Required",
    "428": "Precondition Required",
    "429": "Too Many Requests",
    "431": "Request Header Fields Too Large",
    "451": "Unavailable For Legal Reasons",
    "500": "Internal Server Error",
    "501": "Not Implemented",
    "502": "Bad Gateway",
    "503": "Service Unavailable",
    "504": "Gateway Timeout",
    "505": "HTTP Version Not Supported",
    "506": "Variant Also Negotiates",
    "507": "Insufficient Storage",
    "508": "Loop Detected",
    "510": "Not Extended",
    "511": "Network Authentication Required",
};
export default class Result {
    constructor(response, description, code, res) {
        let version = String(global.URL || "").match(/(v[0-9\.]+)/gi);
        if (Array.isArray(version) && version.length > 0) {
            version = version[0].replace("v", "").split(".");
            version = (version.length == 1 ? version.concat("0") : version).join(".");
        }
        else {
            version = "";
        }
        this.version = version || "";
        code = response && !code ? 200 : !code || code <= 0 ? 404 : code;
        this.code = Object.keys(code_list).includes(String(code)) ? Number(code) : 200;
        this.status = code_list[String(this.code)];
        this.response = response;
        this.description = description || "";
        let start_time, end_time;
        try {
            start_time = new Date(global.startRequest);
            end_time = new Date();
            this.requisitionTime = {
                start: start_time.toISOString(),
                end: end_time.toISOString(),
                response: end_time.getTime() - start_time.getTime(),
            };
        }
        catch {
            start_time = new Date();
            end_time = new Date();
            this.requisitionTime = {
                start: start_time.toISOString(),
                end: end_time.toISOString(),
                response: end_time.getTime() - start_time.getTime(),
            };
        }
        if (res && typeof res.status === "function") {
            if (!res.finished) {
                res.status(this.code).json(this);
            }
        }
    }
}
//# sourceMappingURL=Result.js.map