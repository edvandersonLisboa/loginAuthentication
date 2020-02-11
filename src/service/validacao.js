'use strict';
const jwt = require('jsonwebtoken');
 require('../config/config');

exports.generateToken = async(data) => {
   return jwt.sign(data, global.VALIDACAO_KEY , {expiresIn: '1d'});

}

exports.decodeToken = async (token) =>{
    
    var data = await jwt.verify(token, global.VALIDACAO_KEY);
    
    return data;
}

exports.authorize = async (req, res, next) =>{
    var token = req.headers['x-access-token'];
    
    if(!token){
         res.status(401).json({
            message: 'Erro ao Validar'
        })
    }else{
        await  jwt.verify(token, global.VALIDACAO_KEY, function(error, decoded){
            if(error){
                  res.status(401).json({
                    message: error
                });
            }else{
               return
            }
        })
    }
}