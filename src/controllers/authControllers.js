const express = require("express");
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const router = express.Router();
require('dotenv/config')
router.post(process.env.APP_URL+'/register', async(req,res)=>{
 const {email} = req.body;

    try{
        //verifica se o email já está cadastrado
        if(await User.findOne({ email }))
          return res.status(400).send({ error : 'User already exists'});

        const user = await User.create(req.body);
    // nao retorna o password
        user.password = undefined;
        return res.send({user});


    }catch (err){
        return res.status(400).send({ error: 'Registration failed'});
    }
})

router.post(process.env.APP_URL+'/authenticate', async(req, res) =>{
    const { email, password} = req.body;
   console.log({email},{password} )
    const user = await User.findOne({ email }).select('+password');


    if(!user)
    return res.status(400).send({ error : 'User not found'});
    if(!await bcrypt.compare(password, user.password))
     return  res.status(400).send({error: 'Invalid password'});

     user.password = undefined;
     const token = jwt.sign({id : user.id},  authConfig.secret, {
         //um dia para expiracao
         expiresIn: 86400
     })
     res.send({user, token});
})

module.exports = app => app.use(process.env.APP_URL+'/auth', router);