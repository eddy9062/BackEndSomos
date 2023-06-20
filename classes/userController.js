const model = require('../models/user');

exports.getData()= (req,res) =>{
    model.find({},(err,result) =>{
        res.send({
            result: result
        })
    })
}