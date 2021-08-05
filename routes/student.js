var express = require("express");
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../model/resModel");
const {
  getStudent,
  createStudent,
  delStudent,
  updateStudent,
  getQualifiedScores,
  getUnQualifiedScores,
  getSocreRank
} = require("../controller/student");
const getTableCount = require("../middleware/getTableCount");
const { pageSize } = require("../conf/page");
router.get("/get", (req, res, next) => {
  let {
    studentName,
    classNum,
    grade,
    sex,
    ageBefore,
    ageAfter,
    stuCode,
    curPage,
  } = req.query;
  let result = getStudent(
    studentName,
    classNum,
    grade,
    sex,
    ageBefore,
    ageAfter,
    stuCode,
    curPage
  );
  result.then((data) => {
    res.json(new SuccessModel(data, data.totalPageNum));
    });
});
router.post("/new", (req, res, next) => {
  let result = createStudent(req.body);
  return result.then((data) => {
    res.json(new SuccessModel(data));
  }).catch(err=>{
    res.json(new ErrorModel(err));
  });
});
router.post("/update", (req, res, next) => {
  const result = updateStudent(req.body);
  return result.then((data) => {
    if (!data) {
      res.json(new ErrorModel(data));
    }
    res.json(new SuccessModel(data));
  }).catch(err=>{
    res.json(new ErrorModel(err));
  });
});
router.get("/getQualifiedScores",(req,res,next)=>{
  const result = getQualifiedScores(req.query);
  return result.then(data=>{
  
    res.json(new SuccessModel(data));
  })
})
router.get("/getUnQualifiedScores",(req,res,next)=>{
  const result = getUnQualifiedScores(req.query);
  return result.then(data=>{
    
    res.json(new SuccessModel(data));
  })
})
router.post("/del", (req, res, next) => {
  const result = delStudent(req.body.id);
  return result.then((val) => {
    if (val) {
      res.json(new SuccessModel(val));
    } else {
      res.json(new ErrorModel("删除学生失败"));
    }
  }).catch(err=>{
    res.json(new ErrorModel(err));
  });
});
module.exports = router;
