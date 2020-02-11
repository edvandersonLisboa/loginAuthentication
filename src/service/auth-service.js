'use strict';
const jwt = require('jsonwebtoken');
 require('../config/config');

exports.generateToken = async(data) => {
   return jwt.sign(data, global.SALT_KEY , {expiresIn: '1d'});

}

exports.decodeToken = async (token) =>{
    
    var data = await jwt.verify(token, global.SALT_KEY);
    
    return data;
}

exports.authorize = function (req, res, next){
    var token = req.headers['x-access-token'];
    if(!token){
        return  res.status(401).json({
            message: 'Acesso Restrito'
        })
    }else{
        jwt.verify(token, global.SALT_KEY, function(error, decoded){
            if(error){
                return res.status(401).json({
                    message: "Token Invalido"
                });
            }else{
               next();
            }
        })
    }
}