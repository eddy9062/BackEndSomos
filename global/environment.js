"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_PORT = void 0;
//export const SERVER_PORT: number = 5000;
exports.SERVER_PORT = Number(process.env.PORT) || 5000;
