const mongoose = require('mongoose');
//path e usando mongo cliente
mongoose.set('useCreateIndex', true)

mongoose.connect(MONGO_URL, {useCreateIndex: true,
useNewUrlParser: true,useUnifiedTopology: true });

mongoose.Promise = global.Promise;

module.exports = mongoose;