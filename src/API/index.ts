import type { Fetch } from "../types/api";
import { cache } from "../API/internal";

const API_RESPONSE_EXPIRES = 15;

export function fetch(psth: string): Fetch;
export function fetch(...args: any[]): Fetch {
	return new Promise(() => {});
}

export default class API {}
