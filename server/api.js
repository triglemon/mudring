const express = require('express');
const router = express.Router();


router.post("/test", (req, res) => {
    res.send("welcome to api.js");
})

module.exports = router; 


