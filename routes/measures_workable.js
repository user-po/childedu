var express = require("express");
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../model/resModel");
const getTableCount = require("../middleware/getTableCount");
const { pageSize } = require("../conf/page");
const {getWorkable,createWorkable,updateWorkable,delWorkable} = require('../controller/measures_workable');

router.get('/get',(req,res,next)=>{
    
    let {id,measures_id,curPage} = req.query;
    let result = getWorkable(id,measures_id,curPage);
    result.then((data) => {
      res.json(new SuccessModel(data, data.totalPageNum));
      });
})

router.post('/new',(req,res,next)=>{
  
    const result = createWorkable(req.body);
    return result.then((data) => {
        res.json(new SuccessModel(data));
      }).catch(err=>{
        res.json(new ErrorModel(err));
      });
})
router.post('/update',(req,res,next)=>{
    const result = updateWorkable(req.body);
    return result.then((data) => {
     
      if (!data) {
        res.json(new ErrorModel(data));
      }
      res.json(new SuccessModel(data));
    }).catch(err=>{
      res.json(new ErrorModel(err));
    });
})
router.post('/del',(req,res,next)=>{
    const result = delWorkable(req.body.id);
    return result.then((val) => {
      if (val) {
        res.json(new SuccessModel(val));
      } else {
        res.json(new ErrorModel("删除措施实施情况失败"));
      }
    }).catch(err=>{
      res.json(new ErrorModel(err));
    });
})
module.exports = router
