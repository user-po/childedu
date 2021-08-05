var express = require("express");
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../model/resModel");
const getTableCount = require("../middleware/getTableCount");
const { pageSize } = require("../conf/page");
const {getRelationShip,delRelationShip,createRelationShip,updateRelationShip} = require("../controller/relationShip");
router.get("/get", (req, res, next) => {
        let {id,course_id,organizational_id,curPage} = req.query;
        let result = getRelationShip(id,course_id,organizational_id,curPage);
        result.then((data) => {
          res.json(new SuccessModel(data, data.totalPageNum));
          });
});
router.post('/new',(req,res,next)=>{
    const result = createRelationShip(req.body);
    // if(result.msg){
    //   res.json(new ErrorModel(result.msg));
    // }
    return result.then((data) => {
        res.json(new SuccessModel(data));
      }).catch(err=>{
        res.json(new ErrorModel(data));
      });
})
router.post('/update',(req,res,next)=>{
    const result = updateRelationShip(req.body);
    return result.then((data) => {
     
      if (!data) {
        res.json(new ErrorModel(data));
      }
      res.json(new SuccessModel(data));
    }).catch(err=>{
      res.json(new ErrorModel(data));
    });
})
router.post('/del',(req,res,next)=>{
    const result = delRelationShip(req.body);
  return result.then((val) => {
    if (val) {
      res.json(new SuccessModel(val));
    } else {
      res.json(new ErrorModel("删除课程关系失败"));
    }
  }).catch(err=>{
    res.json(new ErrorModel(err));
  });
})
module.exports = router;
