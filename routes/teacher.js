var express = require("express");
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../model/resModel");
const {
  getTeacher,
  createTeacher,
  delTeacher,
  updateTeacher,
  getTeachersCourse,
  checkCourseIsLogScore,
  getTeacherAllStudents,
  getTeacherStudentsCourse
} = require("../controller/teacher");
const getTableCount = require("../middleware/getTableCount");
const { pageSize } = require("../conf/page");
router.get("/get", (req, res, next) => {
  let { organizational_id, name, title, working_time, curPage } = req.query;
  let result = getTeacher(
    organizational_id,
    name,
    title,
    working_time,
    curPage
  );
  result.then((data) => {
    res.json(new SuccessModel(data, data.totalPageNum));
    });
});

router.post("/new", (req, res, next) => {
  let result = createTeacher(req.body);
  return result.then((data) => {
    res.json(new SuccessModel(data));
  }).catch(err=>{
    res.json(new SuccessModel(err));
  });
});

router.post("/update", (req, res, next) => {
  const result = updateTeacher(req.body);
  return result.then((data) => {
   
    if (!data) {
      res.json(new ErrorModel(data));
    }
    res.json(new SuccessModel(data));
  }).catch(err=>{
    res.json(new SuccessModel(err));
  });
});
router.get("/getTeachersCourse",(req,res,next)=>{
  const result = getTeachersCourse(req.query);
  return result.then((data) => {
   
    if (!data) {
      res.json(new ErrorModel(data));
    }
    res.json(new SuccessModel(data));
  }).catch(err=>{
    res.json(new SuccessModel(err));
  });
})
router.get('/checkCourseIsLogScore',async (req,res,next)=>{
   const result = await checkCourseIsLogScore(req.query)
   console.log(res)
   if(result[0]['count(*)']){
    res.json(new SuccessModel({status:true}));
   }else{
    res.json(new SuccessModel({status:false}));
   }
})
router.post("/del", (req, res, next) => {
  const result = delTeacher(req.body.id);
  return result.then((val) => {
    if (val) {
      res.json(new SuccessModel(val));
    } else {
      res.json(new ErrorModel("删除教师失败"));
    }
  }).catch(err=>{
    res.json(new SuccessModel(err));
  });
});

router.get('/getTeacherAllStudents',(req,res,next)=>{
  const result = getTeacherAllStudents(req.query);
  return result.then((val) => {
    if (val) {
      res.json(new SuccessModel(val,val.totalPageNum));
    } else {
      res.json(new ErrorModel("获取失败"));
    }
  }).catch(err=>{
    res.json(new SuccessModel(err));
  });
})

router.get('/getTeacherStudentsCourse',(req,res,next)=>{
  const result = getTeacherStudentsCourse(req.query);
  return result.then((val) => {
    if (val) {
      res.json(new SuccessModel(val));
    } else {
      res.json(new ErrorModel("获取失败"));
    }
  }).catch(err=>{
    res.json(new SuccessModel(err));
  });
})
module.exports = router;
