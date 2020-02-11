const mongoose = require('../database/conexaoBd');
const bcrypt  = require('bcryptjs')
const { cpf } = require('cpf-cnpj-validator');

const correntistaSchema = new mongoose.Schema({
    nome: {
        type: String,
        require: true,
        },
    email: {
        type: String,
        unique: true,// unico
        required:true,// requerido obrigatorio
        lowercase: true// tudo caixa baixa
    },
    cpf:{
        type: String,
        unique: true,// unico
        required:true,// requerido obrigatorio
    },
    senha: {
        type: String,
        required:true,
         // essa informacao da senha nunca retorna para usuario
    },
    validacao:{
        type: String,
        required:true,
    },
    agencia: {
        type: String,
        required:true,
    },
    conta:{
        type: String,
        unique: true,// unico
        required:true,
    },
    saldo:{
        type: String,
        required:true,
    },
    ativo:{
        type: Boolean,
        required:true,
    },
    
});

correntistaSchema.pre('save', async function(next){

    const hash = await bcrypt.hash(this.senha, 10);
    const valid = await bcrypt.hash(this.validacao, 10);
    this.validacao = valid;
    this.cpf = cpf.format(this.cpf);
    this.senha = hash;

    next();
}) 
const Correntista = mongoose.model('correntistas', correntistaSchema);

module.exports = Correntista;