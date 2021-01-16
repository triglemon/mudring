const express = require('express'); //handles routing and the urls for us 
const morgan =require('morgan'); 
const router = express.Router() ; 
const app = express() ; 
const api = require('./api'); 


app.use(morgan('tiny')); 
app.use('express.json')

app.use('/api' , api); 


const PORT = process.env.PORT || 56565 ; 

app.listen(PORT , (err)=>{
    if(err){
        console.log(err)
    }else {
        console.log(`server listening on port: ${PORT}`); 
    }
})
morg