const mongoose = require('../database');
const bcrypt  = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
       type: String,
       unique: true,// unico
       required:true,// requerido obrigatorio
       lowercase: true// tudo caixa baixa
    },
    password: {
        type: String,
        required:true,
        select: false // essa informacao da senha nunca retorna para usuario
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
}) 
const User = mongoose.model('User', UserSchema);

module.exports = User;