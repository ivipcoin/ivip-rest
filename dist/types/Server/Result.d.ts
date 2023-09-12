import { Response } from "express";
export default class Result {
    version: string;
    code: number;
    status: string;
    response: any;
    description: string;
    requisitionTime: {
        start: string;
        end: string;
        response: number;
    };
    constructor(response: any, description?: string, code?: number, res?: Response);
}
//# sourceMappingURL=Result.d.ts.map