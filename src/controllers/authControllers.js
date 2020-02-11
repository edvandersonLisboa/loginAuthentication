const express = require("express");
const Correntistas = require('../models/correntista');
const bcrypt = require('bcryptjs');
const authenticacaoLogin= require('../service/auth-service');
const validacaoToken= require('../service/validacao');
const router = express.Router();
const { cpf } = require('cpf-cnpj-validator');
var validatorEmail = require("email-validator");
// const userAgregatio = require('../models/agregacaoUsuario')
require('dotenv/config')
//rota para o registro
router.post('/register', async(req,res)=>{
 const {conta} = req.body;
 const {agencia} = req.body;

    if(req.body.agencia.length != 4)
        return res.status(201).json({ 
        msg: "Agencia não é Valida"
        });
    if(req.body.conta.length != 12)
        return res.status(201).json({ 
            msg: "Conta Não é Valida."
            });

    if(cpf.isValid(req.body.cpf) == false)
        return res.status(201).json({ 
            msg: "Cpf não é Valido."
            });
    
    if(validatorEmail.validate(req.body.email) == false)
        return res.status(201).json({ 
            msg: "Email Nao e valido."
        });
    
    // try{
        //verifica se o email já está cadastrado
        if(await Correntistas.findOne({  conta, agencia }))
          return res.status(400).send({ error : 'User already exists'});

       
         
        
        const contaCadastrada= await Correntistas.create(req.body);
        // userAgregatio();
    // nao retorna o password
    contaCadastrada.senha = undefined;
    contaCadastrada.cpf = undefined;
    contaCadastrada.saldo =undefined;
        return res.send({contaCadastrada});

    // }catch (err){
        // return res.status(400).send({ error: err});
    // }
})
//rota para authenticacao
router.post('/authenticate', async(req, res) =>{

    const { cpf } = req.body;
    const  senha = req.body.senha;
    if(req.body.conta.length != 12)
    return res.status(201).json({ 
        msg: "Conta Não é Valida."
        });
 
    if(req.body.senha.length == 6 ){
        return res.status(201).json({ 
            msg: "senha Não é Valida."
            });

    }
        
    
    const customConta = await Correntistas.findOne({ cpf });
    
  
     
    if(!customConta)
    return res.status(404).send({ error : 'Usuario nao existe'});
    if( await bcrypt.compare(senha, customConta.senha)){
        const token = await authenticacaoLogin.generateToken({email: customConta.email });
        customConta.senha = undefined;
        customConta.transacao = undefined;
        return res.status(201).json({ token, msg: "Usuario Encontrado com Sucesso." });
    }else{
        return res.status(400).json({  msg: "Usuario não Encontrado!" });
    }
})

router.post('/validacao', async (req,res)=>{
    const {conta} = req.body.conta;
    const _validacao = req.body.validacao;
    const customConta = await Correntistas.findOne({conta});

    if(req.body.senha.length == 4 && senha.match("[0-9]+").index == 4){
        return res.status(201).json({ 
            msg: "senha Não é Valida."
            });
    }

    if(await bcrypt.compare(_validacao, customConta.validacao)){
        const tokenValidacao = await validacaoToken.generateToken({_validacao});
        
        return  res.status(200).json({
            message: "Acesso Autorizado com Sucesso",
            token: tokenValidacao
        });

     } else{
        
        return res.status(401).json({
                 message: "Senha Invalida, tente outra vez?"
             }); 

     }
})

module.exports = app => app.use('/auth', router);