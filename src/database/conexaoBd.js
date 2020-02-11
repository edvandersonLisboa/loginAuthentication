const mongoose = require('mongoose');
require('dotenv/config')
//path e usando mongo cliente
mongoose.set('useCreateIndex', true)

mongoose.connect(process.env.MONGO_URL, {useCreateIndex: true,
useNewUrlParser: true,useUnifiedTopology: true });

mongoose.Promise = global.Promise;

module.exports = mongoose;