const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017/Sistema';

const option = {
                keepAlive: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                maxPoolSize: 30
            }

const client = new MongoClient(url,option);

process.on('SIGINT',async ()=>{
    try{
        await client.close();
        process.exit(0)
    }catch(error){
        console.log(error)
        process.exit(1)
    }
})

module.exports = client;

/*const mongoose = require('mongoose');

const DB_URI = 'mongodb://localhost:27017/Sistema';

module.exports =() =>{
    const connect = () =>{
        mongoose.connect(
            DB_URI,
            {
                keepAlive: true,
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
            (err) =>{
                if(err){
                    console.log('DB ERROR !!')
                }else{
                    console.log('Conexión Correcta !!')
                }
            }
        )
    }
    connect();
}*/