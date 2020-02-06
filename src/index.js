const  express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//rota do controllers pode usar consign
require('./controllers/authControllers')(app);
app.get('/', (req, res) =>{
 
    console.log('Ok');

})

app.listen(3000, ()=>{
    console.log("rodando na porta 3000s")
})