var express = require("express");
var router = express.Router();
const {
  getOrganization,
  createOrganization,
  delOrganization,
  updateOrganization,
  getUnqualifiedStudents,
  getSpecialRecordStudents
} = require("../controller/organizational");
const { SuccessModel, ErrorModel } = require("../model/resModel");
const getTableCount = require("../middleware/getTableCount");
const { pageSize } = require("../conf/page");
router.get("/get", (req, res, next) => {
  let type = req.query.type;
  let name = req.query.name;
  let contact_people = req.query.contact_people;
  let curPage = req.query.curPage;
  let province = req.query.province;
  let city = req.query.city;
  let area = req.query.area;
  let addresss = req.query.address;
  
  let result = getOrganization(
    type,
    name,
    contact_people,
    province,
    city,
    area,
    curPage,
    addresss
  );
  return result.then((data) => {
    res.json(new SuccessModel(data, data.totalPageNum));
  });
});

router.post("/new", (req, res, next) => {
  const result = createOrganization(req.body);

  return result.then((data) => {
    res.json(new SuccessModel(data));
  }).catch(err=>{
    res.json(new ErrorModel(err));
  });
});
router.post("/update", (req, res, next) => {
  const result = updateOrganization(req.body);
  return result.then((data) => {
 
    if (!data) {
      res.json(new ErrorModel(data));
    }
    res.json(new SuccessModel(data));
  }).catch(err=>{
    res.json(new ErrorModel(err));
  });
});
router.get("/getUnqualifiedStudents",(req,res,next)=>{
  let result = getUnqualifiedStudents(req.query);
  
  return result.then(data=>{
    
    res.json(new SuccessModel(data));
  })
})
router.get("/getSpecialRecordStudents",(req,res,next)=>{
  let result = getSpecialRecordStudents(req.query);
  
  return result.then(data=>{
    
    res.json(new SuccessModel(data));
  })
})
router.post("/del", (req, res, next) => {
  const result = delOrganization(req.body.id);
  return result.then((val) => {
    if (val) {
      res.json(new SuccessModel(val));
    } else {
      res.json(new ErrorModel("删除机构失败"));
    }
  }).catch(err=>{
    res.json(new ErrorModel(err));
  });
});

module.exports = router;
