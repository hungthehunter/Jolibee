const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
router.get("/config", (req, res) =>{
    const dataConfig = process.env.PAYPAL_CLIENT;
    {return res.status(200).json({
    status: 'OK',
    data: dataConfig
})}
});


module.exports = router; 