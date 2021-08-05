var express = require("express");
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../model/resModel");
const getTableCount = require("../middleware/getTableCount");
const { pageSize } = require("../conf/page");
const {getMeasures,createMeasures,updateMeasures,delMeasures,getDetail} = require('../controller/measures');
router.get('/get',(req,res,next)=>{
   
    let {id,score_id,curPage} = req.query;
    let result = getMeasures(id,score_id,curPage);
    result.then((data) => {
      res.json(new SuccessModel(data, data.totalPageNum));
      });
})

router.post('/new',(req,res,next)=>{
    const result = createMeasures(req.body);
    return result.then((data) => {
        res.json(new SuccessModel(data));
      }).catch(err=>{
        res.json(new ErrorModel(err));
      });
})

router.get('/detail',(req,res,next)=>{
  const result = getDetail(req.query);

  return result.then(data=>{
    res.json(new SuccessModel(data));
  })
})
router.post('/update',(req,res,next)=>{
    const result = updateMeasures(req.body);
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
    const result = delMeasures(req.body.id);
    return result.then((val) => {
      if (val) {
        res.json(new SuccessModel(val));
      } else {
        res.json(new ErrorModel("删除措施失败"));
      }
    }).catch(err=>{
      res.json(new ErrorModel(err));
    });
})

module.exports = router;