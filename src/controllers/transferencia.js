const express = require("express");
const Correntista = require('../models/correntista');
const Transferencias = require('../models/transferencia');
const validacaoToken = require('../service/validacao');
const router = express.Router();
require('dotenv/config')

//transferencia da lista
router.get('/lista', async(req, res,next) =>{
       const _cpf = req.body.cpf;

      validacaoToken.authorize(req, res, next); 
      const listaTransferencias = await Transferencias.find({cpf: _cpf});
      if(listaTransferencias){
        return  res.status(400).json({
         transferencias: listaTransferencias 
        })
    }else{
        return  res.status(200).json({
             msg : "Não nenhuma transferência Efetuada" 
           })
    }
})

//transferencia de Update
router.post('/update', async(req, res,next) =>{

     validacaoToken.authorize(req, res, next);
     const nome_env = req.body.nome_titular_env;
     const conta_env = req.body.conta_titular_env;
     const agencia_env = req.body.agencia_titular_env;
     const cpf_env = req.body.cpf_titular_env;
     const descricao_env = req.body.descricao;
       
     //########################################

     const nome_receb = req.body.nome_titular_receb;
     const agencia_receb = req.body.agencia_titular_receb;
     const conta_receb = req.body.conta_titular_receb;
     const cpf_receb = req.body.cpf_titular_receb;
     
     const descricao_receb = "Você acabou de receber um deposito, no valor de R$ "+req.body.valor; 
     //######################################
     const data_transferencia = new Date();
     const valorTransferencia = req.body.valor;
     const hashTranferencia =   cpf_receb+""+cpf_env+""+new Date();


    const contaEnv =await Correntista.findOne({conta: conta_env});
    const contaReceb = await Correntista.findOne({conta: conta_receb})
    
        if( contaEnv.saldo >= valorTransferencia ){
            try{
                await  Transferencias.create({
                    nome:nome_receb,
                    conta:conta_receb,
                    cpf:cpf_receb,
                    agencia: agencia_receb,
                    status:"enviado",
                    descricao:descricao_receb,
                    valor:valorTransferencia,
                    data:data_transferencia,
                    hash:hashTranferencia
                })
                await Correntista.updateOne({conta: conta_env},
                    {
                        $set:{
                            saldo: (parseFloat(contaEnv.saldo) - parseFloat( valorTransferencia)).toString()
                        }
                    })
    
                await Transferencias.create({
                    nome: nome_env,
                    conta: conta_env,
                    cpf: cpf_env,
                    agencia: agencia_env,
                    status: "recebida",
                    descricao: descricao_env,
                    valor: valorTransferencia,
                    data:data_transferencia,
                    hash: hashTranferencia
                })    
                await Correntista.updateOne({conta: conta_receb},
                    {
                        $set:{
                            saldo: (parseFloat(contaReceb.saldo) + parseFloat( valorTransferencia)).toString(),
                        }
                })
    
                return  res.status(400).json({
                    msg: "transferencia efetuada com sucesso" 
                })


            }catch(e){
                return  res.status(200).json({
                    msg: "transferencia não realizada" 
                })

            }
           
        }else{
            return  res.status(200).json({
                msg: "Saldo Insuficiente" 
            })

        }
     
})

//transferencia extrato 
router.get('/extrato/:hash', async(req, res,next) =>{
    const conta_titular = req.body.conta;
    const hash_tranferencia = req.params.hash;

   validacaoToken.authorize(req, res, next); 
   const listaTransferencias = await Transferencias.findOne({conta: conta_titular, hash: hash_tranferencia });

return  res.status(200).json({
      extrato: listaTransferencias 
  })
})



module.exports = app => app.use('/transacao', router);