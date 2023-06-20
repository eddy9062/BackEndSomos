const mongoClient = require('../sockets/db')

const mongoClientMiddleware = async (req,res,next)=>{
    try {
        await mongoClient.connect();
        req.db = mongoClient.db();
        next();
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Erro del Servidor'})
    }
}

module.exports = mongoClientMiddleware