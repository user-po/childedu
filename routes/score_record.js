var express = require("express");
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../model/resModel");
const getTableCount = require("../middleware/getTableCount");
const { pageSize } = require("../conf/page");
const {getScore,createScore,delScore,updateScore,getScoreRank} = require('../controller/score_record')
router.get('/get',(req,res,next)=>{
    let {studentId,relation_id,id,curPage} = req.query;
    let result = getScore(studentId,relation_id,id,curPage);
    result.then((data) => {
      res.json(new SuccessModel(data, data.totalPageNum));
      });
  
})

router.post('/new',(req,res,next)=>{
    
    const result = createScore(req.body);
    return result.then((data) => {
        res.json(new SuccessModel(data));
      }).catch(err=>{
        res.json(new ErrorModel(err));
      });
})
router.post('/update',(req,res,next)=>{
    const result = updateScore(req.body);
    return result.then((data) => {
     
      if (!data) {
        res.json(new ErrorModel(data));
      }
      res.json(new SuccessModel(data));
    }).catch(err=>{
      res.json(new ErrorModel(err));
    });
})
router.get('/scoreRank',(req,res,next)=>{
  const result = getScoreRank(req.query);

  return result.then(data=>{
   res.json(new SuccessModel(data));
  })
})
router.post('/del',(req,res,next)=>{
    const result = delScore(req.body.id);
    return result.then((val) => {
      if (val) {
        res.json(new SuccessModel(val));
      } else {
        res.json(new ErrorModel("删除成绩失败"));
      }
    }).catch(err=>{
      res.json(new ErrorModel(err));
    });
}
)


module.exports = router