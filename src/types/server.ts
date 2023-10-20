import type { Request, Response, NextFunction } from "express";

export type PreRouteMiddleware = (req: Request, res: Response, next: NextFunction) => void;

export interface RequiresAccess {
	user: string;
	password: string;
}

export type RouteComponentConfig = Partial<{
	/**O caminho da rota.*/
	path: string;
	/**O método HTTP da rota. */
	method: "all" | "get" | "put" | "delete" | string[];
	/**O nível de acesso necessário para acessar a rota. */
	requiresAccess: RequiresAccess | null;
	/**Define se a rota só pode ser acessada no servidor. */
	serverOnlyRequest: boolean;
	/**Define se a rota só pode ser acessada por usuários autenticados. */
	onlyAuthorizedRequest: boolean;
	/**A duração em segundos do cache da rota. */
	lifetime: number;
	/**Define se o cache da rota é feito por usuário. */
	cacheByUser: boolean;
	/**Lista de chaves de cache adicionais para a rota. */
	cacheByRequest: string[];
}>;

export interface FunctionRouteProps extends Request {
	[key: string]: any;
}

export type mimeTypes =
	| "text/plain"
	| "model/stl"
	| "application/x-mobipocket-ebook"
	| "audio/aac"
	| "audio/opus"
	| "application/pdf"
	| "image/vnd.adobe.photoshop"
	| "audio/ape"
	| "video/x-flv"
	| "application/x-esri-shape"
	| "image/gif"
	| "image/x-sony-arw"
	| "image/x-adobe-dng"
	| "image/x-panasonic-rw2"
	| "application/x-deb"
	| "video/mp4"
	| "application/x-apache-arrow"
	| "video/quicktime"
	| "video/3gpp2"
	| "image/bpg"
	| "image/jpeg"
	| "image/png"
	| "image/webp"
	| "image/flif"
	| "image/bmp"
	| "image/tiff"
	| "image/x-xcf"
	| "image/x-canon-cr2"
	| "image/x-canon-cr3"
	| "image/vnd.ms-photo"
	| "application/x-indesign"
	| "application/epub+zip"
	| "application/x-rar-compressed"
	| "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
	| "application/msword"
	| "application/gzip"
	| "application/x-tar"
	| "application/x-bzip2"
	| "application/x-7z-compressed"
	| "application/x-apple-diskimage"
	| "audio/midi"
	| "video/x-matroska"
	| "video/webm"
	| "video/mpeg"
	| "audio/mpeg"
	| "audio/mp3"
	| "video/ogg"
	| "audio/x-flac"
	| "audio/wavpack"
	| "audio/amr"
	| "application/x-elf"
	| "application/x-shockwave-flash"
	| "application/rtf"
	| "application/wasm"
	| "audio/x-wav"
	| "audio/x-musepack"
	| "text/calendar"
	| "application/eps"
	| "application/x-xz"
	| "application/x-sqlite3"
	| "application/x-nintendo-nes-rom"
	| "application/x-compress"
	| "video/mp2t"
	| "application/x-blender"
	| "image/j2c"
	| "image/jp2"
	| "image/jpx"
	| "image/jpm"
	| "image/mj2"
	| "audio/aiff"
	| "application/xml"
	| "application/tar+gzip"
	| "application/vnd.tcpdump.pcap"
	| "audio/x-dsf"
	| "application/x.ms.shortcut"
	| "application/x.apple.alias"
	| "image/x-olympus-orf"
	| "image/x-fujifilm-raf"
	| "audio/x-it"
	| "image/x-icon"
	| "application/x-msdownload"
	| "application/vnd.ms-htmlhelp"
	| "model/3mf"
	| "image/jxl"
	| "application/zstd"
	| "image/jls"
	| "audio/x-rmf"
	| "application/vnd.ms-outlook"
	| "audio/x-mid"
	| "application/x-arj"
	| "application/x-squashfs"
	| "application/vnd.iccprofile"
	| "application/octet-stream"
	| "application/json"
	| "text/html"
	| "text/javascript";

export type statusCode =
	| 200
	| 201
	| 202
	| 203
	| 204
	| 205
	| 206
	| 300
	| 301
	| 302
	| 303
	| 304
	| 305
	| 306
	| 307
	| 308
	| 400
	| 401
	| 402
	| 403
	| 404
	| 405
	| 406
	| 407
	| 408
	| 409
	| 410
	| 411
	| 412
	| 413
	| 414
	| 415
	| 416
	| 417
	| 418
	| 421
	| 425
	| 426
	| 428
	| 429
	| 431
	| 451
	| 500
	| 501
	| 502
	| 503
	| 504
	| 505
	| 506
	| 507
	| 508
	| 510
	| 511;

export type FunctionRouteDone = (content: object | boolean | number | bigint | string | Buffer | null, typeContent: mimeTypes, status: statusCode) => any;

export interface FunctionRouteUtils {
	done: FunctionRouteDone;
	error: (mss: object | string | null | undefined, code: statusCode) => any;
	dispatch: (path: string, body?: object | null, lifetime?: number) => any | Promise<any>;
	requiresAccess: (logins: Array<{ user: string; password: string }>) => Promise<any> | any;
	request: (request: object) => object;
	checkAuthorization?: (request: Request) => Promise<any> | any;
}

export type FunctionRoute<RouteResources = any> = (props: FunctionRouteProps, utils: FunctionRouteUtils & RouteResources) => any | Promise<any>;
