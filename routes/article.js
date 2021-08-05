var express = require("express");
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../model/resModel");
const getTableCount = require("../middleware/getTableCount");
const { pageSize } = require("../conf/page");
const {getArticle,createArticle,delArticle,updateArticle} = require('../controller/article')
router.get('/get',async (req,res,next)=>{
    let {module_code,module_id,title,release_time,issuer,is_recommend,modified_time,play_count,curPage,userType,userId} = req.query;

    let result = await getArticle(module_code,module_id,title,release_time,issuer,is_recommend,modified_time,play_count,curPage,userType,userId);
    res.json(new SuccessModel(result, result.totalPageNum));
})
router.post('/update',(req,res,next)=>{
  const result = updateArticle(req.body);
  return result.then((data) => {
   
    if (!data) {
      res.json(new ErrorModel(data));
    }
    res.json(new SuccessModel(data));
  }).catch(err=>{
    res.json(new ErrorModel(err));
  });
})
router.post('/new',(req,res,next)=>{
  const result = createArticle(req.body);
  return result.then((data) => {
      res.json(new SuccessModel(data));
    }).catch(err=>{
      res.json(new ErrorModel(err));
    });
})

router.post('/del',(req,res,next)=>{
  const result = delArticle(req.body.id);
  return result.then((val) => {
    if (val) {
      res.json(new SuccessModel(val));
    } else {
      res.json(new ErrorModel("删除文章失败"));
    }
  }).catch(err=>{
    res.json(new ErrorModel(err));
  });
})



module.exports = router