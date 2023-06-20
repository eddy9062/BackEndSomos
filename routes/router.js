"use strict";
var __awaiter = (this && this.__awaiter) || function(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function(resolve) { resolve(value); }); }
    return new(P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }

        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }

        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = __importDefault(require("../classes/server"));
const oracleDB_1 = require("../sockets/oracleDB");
const router = (0, express_1.Router)();
const mongoClientMiddleware = require('../middlewares/mongoMiddleware');
const ObjectID = require('mongodb').ObjectID

router.get('/mensajes', mongoClientMiddleware, (req, res) => {
    res.json({
        ok: true,
        mensaje: 'Todo esta bien!!'
    });
});
router.post('/mensajes', (req, res) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    res.json({
        ok: true,
        cuerpo,
        de
    });
});
router.post('/mensajes/:id', (req, res) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;
    res.json({
        ok: true,
        cuerpo,
        de,
        id
    });
});

//Autenticacióin
router.post('/validaUsuario', mongoClientMiddleware, async(req, res) => {
    let body = req.body;
    let result2;
    console.log(body)
    try {
        result2 = await req.db.collection('user').findOne(body);
        //server.io.emit('codigo-empleado', result2);
    } catch (error) {
        //hacer lo mismo del midderwarea
        console.log(error)
        console.log('entre al Catch')
    }

    //console.log(result)
    //result= Object.assign(result,body)
    res.json(result2)

});
//Listado de partidos
router.post('/partidos', mongoClientMiddleware, async(req, res) => {
    let body = req.body;
    let result2;
    console.log(body)
    try {
        result2 = await req.db.collection('partido').find().toArray();
        //server.io.emit('codigo-empleado', result2);
    } catch (error) {
        //hacer lo mismo del midderwarea
        console.log(error)
        console.log('entre al Catch')
    }

    //console.log(result)
    //result= Object.assign(result,body)
    res.json(result2)

});

//data inicial
router.post('/data', mongoClientMiddleware, async(req, res) => {
    let idUSer = req.body

    let result2;
    console.log(idUSer)
    try {
        result2 = await req.db.collection('movimiento').find(idUSer).toArray();
        //server.io.emit('codigo-empleado', result2);
    } catch (error) {
        //hacer lo mismo del midderwarea
        console.log(error)
        console.log('entre al Catch')
    }
    res.json(result2)

});

//total de mesas ingresadas
router.post('/mesasIngresadas', mongoClientMiddleware, async(req, res) => {
    let resultCount;
    try {
        resultCount = await req.db.collection('movimiento').count();
    } catch (error) {
        console.log(error)
    }
    //result= Object.assign(result,body)
    res.json([{
                name: 'Registros',
                y: (resultCount / 83 * 100),
                color: 'green'
            },
            {
                name: 'Pendiente',
                y: Math.round((83 - resultCount) / 83 * 100, 2),
                color: 'red'
            }
        ])
        //res.json([83, resultCount])

});


//Listado de partidos
router.post('/insert_data', mongoClientMiddleware, async(req, res) => {
    let Data = req.body
    const server = server_1.default.instance;
    let result2;
    let result;
    let resultCount;
    //console.log(Data)
    try {
        //console.log(Data.usuario)
        //result = await req.db.collection('movimiento').findOne({ "usuario": Data.usuario.toString() });
        result = await req.db.collection('movimiento').deleteOne({ "usuario": Data.usuario.toString() });
        console.log(result)
        if (result.deletedCount === 0 | result.deletedCount === 1) {
            result = await req.db.collection('movimiento').insertOne(Data);
            result2 = await req.db.collection('v_resultado').find().toArray();
            resultCount = await req.db.collection('movimiento').count();
        }
        server.io.emit('codigo-empleado', result2);
        server.io.emit('mesas-ingresadas', [{
                name: 'Registros',
                y: (resultCount / 83 * 100),
                color: 'green'
            },
            {
                name: 'Pendiente',
                y: Math.round((83 - resultCount) / 83 * 100, -1),
                color: 'red'
            }
        ]);
    } catch (error) {
        //hacer lo mismo del midderwarea
        console.log(error)
            //console.log('entre al Catch')
    }

    //console.log(result)
    //result= Object.assign(result,body)
    res.json(result)

});


router.post('/resumen_ini', mongoClientMiddleware, async(req, res) => {
    let result2;
    try {
        result2 = await req.db.collection('v_resultado').find().toArray();
        //server.io.emit('codigo-empleado', result2);
    } catch (error) {
        //hacer lo mismo del midderwarea
        console.log(error)
        console.log('entre al Catch')
    }

    //console.log(result)
    //result= Object.assign(result,body)
    res.json(result2)

});

/*
router.post('/data', mongoClientMiddleware, async(req, res) => {
    let idUSer = req.body

    let result2;
    console.log(idUSer)
    try {
        result2 = await req.db.collection('movimiento').find(idUSer).toArray();
        //server.io.emit('codigo-empleado', result2);
    } catch (error) {
        //hacer lo mismo del midderwarea
        console.log(error)
        console.log('entre al Catch')
    }

    //console.log(result)
    //result= Object.assign(result,body)
    res.json(result2)

});*/


/*
    cors({
      origin: ['*.*','*'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
    })*/
router.post('/empleado', (req, resp) => __awaiter(void 0, void 0, void 0, function*() {
    //console.log(req.params)
    console.log(req.body)
    const server = server_1.default.instance;
    const codigo = req.body.codigo;
    let result = {
        ok: true,
        message: 'Registro exitoso'
    };
    yield(0, oracleDB_1.run)(codigo).then((res) => {
        //console.log(JSON.stringify(res))
        console.log(res)
        if (res.length === 0) {
            //console.log('Entre')
            result = {
                ok: false,
                message: 'Código de empleado no tiene orden de alimentación'
            };
        } else {
            //  console.log('Entre2')
            server.io.emit('codigo-empleado', res);
        }
    });
    resp.json({
        result
    });
    //console.log(codigo);
    //console.log(payload);
    //    const server = Server.instance;
    //server.io.in(id).emit('codigo-empleado',payload);
    //   server.io.emit('codigo-empleado',menu);
}));


router.post('/lugar', mongoClientMiddleware, async(req, res) => {
    let body = req.body;
    //body.fecha = new Date();
    let result2;
    try {
        await req.db.collection('lugar').insertOne(body);
        result2 = await req.db.collection('lugar').find().toArray();
    } catch (error) {
        //hacer lo mismo del midderwarea
        console.log(error)
    }

    res.json(result2)

});

router.post('/usuario', mongoClientMiddleware, async(req, res) => {
    let body = req.body;
    //body.fecha = new Date();
    let result2;
    try {
        await req.db.collection('user').insertOne(body);
        result2 = await req.db.collection('user').find().toArray();
    } catch (error) {
        //hacer lo mismo del midderwarea
        console.log(error)
    }

    res.json(result2)

});

router.post('/partido', mongoClientMiddleware, async(req, res) => {
    let body = req.body;
    body.fecha = new Date();
    let result2;
    try {
        for (let i = 0; i < body.length; i++) {
            const element = body[i];
            await req.db.collection('partido').insertOne(element);
        }

        result2 = await req.db.collection('partido').find().toArray();
        //server.io.emit('codigo-empleado', result2);
    } catch (error) {
        //hacer lo mismo del midderwarea
        console.log(error)
    }

    //console.log(result)
    //result= Object.assign(result,body)
    res.json(result2)

});



router.post('/registro', mongoClientMiddleware, async(req, res) => {
    let body = req.body;
    body.fecha = new Date();
    let result2;
    try {

        await req.db.collection('movimiento').insertOne(body);
        result2 = await req.db.collection('movimiento').find().toArray();
        //server.io.emit('codigo-empleado', result2);
    } catch (error) {
        //hacer lo mismo del midderwarea
        console.log(error)
    }

    //console.log(result)
    //result= Object.assign(result,body)
    res.json(result2)

});




exports.default = router;