var express = require("express");
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../model/resModel");
const {
   login
} = require("../controller/user");


router.post('/login',(req,res,next)=>{
    const result = login(req.body);

    return result.then((data) => {
       
        if(data.length !== 0){
            res.json(new SuccessModel(data));
        }else{
            res.json(new ErrorModel({
                msg:'用户名或密码错误'
            }))
        }
      }).catch(err=>{
        res.json(new ErrorModel(err));
      });

})



module.exports = router;