const mongoose = require('../database/conexaoBd');
const bcrypt  = require('bcryptjs')


const transferenciaSchema = new mongoose.Schema({
    nome: {
        type: String,
        require: true,
        },
    cpf:{
        type: String,
        required:true,// requerido obrigatorio
    },
    agencia: {
        type: String,
        required:true,
    },
    conta:{
        type: String,
        required:true,
    },
    status:{
        type: String,
        required:true,
    },
    descricao:{
        type: String,
        required:true,
    },
    valor:{
        type: String,
        required:true,
    },
    hash:{
        type: String,
        required:true,
    },
    data:{
        type: Date,
        required:true,
    }
    
   
});

transferenciaSchema.pre('save', async function(next){

    const hash = await bcrypt.hash(this.hash, 10);
    
    this.hash = hash.replace(/\//gi,"");

    next();
}) 
const Transferencia = mongoose.model('transferencias', transferenciaSchema);

module.exports = Transferencia;