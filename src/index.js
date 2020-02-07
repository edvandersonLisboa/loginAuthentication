const  express = require('express');
const bodyParser = require('body-parser');
 require('dotenv/config')
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//rota do controllers pode usar consign
require('./controllers/authControllers')(app);
app.get('/', (req, res) =>{
 
   

})

app.listen( process.env.PORT || 3000, ()=>{
    console.log( process.env.APP_URL);
})