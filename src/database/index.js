const mongoose = require('mongoose');
//path e usando mongo cliente
mongoose.set('useCreateIndex', true)

mongoose.connect('mongodb+srv://noderest:%23root@noderest-pibrk.azure.mongodb.net/test?retryWrites=true&w=majority', {useCreateIndex: true,
useNewUrlParser: true,useUnifiedTopology: true });

mongoose.Promise = global.Promise;

module.exports = mongoose;