"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const router_1 = __importDefault(require("./routes/router"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const oracledb = require('oracledb');
const server = server_1.default.instance;

//mongoDb
//const mongodb = require('./sockets/db')

// CORS
server.app.use((0, cors_1.default)());
// BodyParser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
/*cors({
  origin: ['*.*','*'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
})

server.app.use( cors );*/
server.app.use('/', router_1.default);
/*server.app.use(
  cors({
    origin: ['*.*','*'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
  })
);*/
server.start(() => {
  //para que inicie la conexio a mongodb
  //mongodb();
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});
