var express = require("express");
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../model/resModel");
const {getModule} = require('../controller/module');

router.get('/get',(req,res,next)=>{
    let {name} = req.query;
    let result = getModule(name);
    result.then((data) => {
        res.json(new SuccessModel(data));
      });
})

module.exports=router;