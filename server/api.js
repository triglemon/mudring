const express = require('express');
const router = express.Router();

function doSomething() {
    return ("do something"); 
}
function doSomethingElse() {
    return ("do something else"); 
}

router.post("/test", (req, res) => {

    res.send(doSomething());
})

router.post("/second" , (req, res)=> {
    res.send(doSomethingElse());
})

module.exports = router; 


