var express = require("express");
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../model/resModel");
const getTableCount = require("../middleware/getTableCount");
const { pageSize } = require("../conf/page");
const {getStudentWork,createStudentWork,updateStudentWork,delStudentWork,getDetail} = require('../controller/student_work_record');
router.get('/get',(req,res,next)=>{
    let {code,name,id,curPage} = req.query;
    let result = getStudentWork(id,code,name,curPage);
    result.then((data) => {
      res.json(new SuccessModel(data, data.totalPageNum));
      });
})
router.post('/new',(req,res,next)=>{
    const result = createStudentWork(req.body);
    return result.then((data) => {
        res.json(new SuccessModel(data));
      }).catch(err=>{
        res.json(new ErrorModel(err));
      });
})
router.post('/update',(req,res,next)=>{
    const result = updateStudentWork(req.body);
    return result.then((data) => {
     
      if (!data) {
        res.json(new ErrorModel(data));
      }
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
router.post('/del',(req,res,next)=>{
    const result = delStudentWork(req.body.id);
    return result.then((val) => {
      if (val) {
        res.json(new SuccessModel(val));
      } else {
        res.json(new ErrorModel("删除作业失败"));
      }
    }).catch(err=>{
      res.json(new ErrorModel(err));
    });
})

module.exports = router;