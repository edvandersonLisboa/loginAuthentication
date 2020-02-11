const  express = require('express');
const bodyParser = require('body-parser');
const consign = require('consign')
 require('dotenv/config')
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//rota do controllers pode usar consign

consign()
  .include('src/controllers')
  .into(app);

app.get('/', (req, res) =>{
 
    res.write("<h1>Api Funcionando</h1>");

})

app.listen( process.env.PORT || 3000, ()=>{
   
})