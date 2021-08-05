var express = require("express");
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../model/resModel");
const getTableCount = require("../middleware/getTableCount");
const { pageSize } = require("../conf/page");
const path = require("path");
const multer = require("multer")
const {getModule} = require('../controller/module')
const {PORT} = require('../conf/port')
const {createFile,getFile,updateFile,delFile}=require('../controller/fileStorage');
var changedName
var url = require('url');
var fs = require('fs');
let upload = multer({
  storage: multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, './uploads/');
      },
      filename: function (req, file, cb) {
        
          changedName = (new Date().getTime())+'-'+file.originalname;
          cb(null, changedName);
      }
  })
})
router.get('/show/:file__name',async (request,response)=>{
  
   // 获得URL的path，类似 '/css/bootstrap.css':
   var pathName = request.params.file__name;
    
   if(!pathName){
    response.json(new ErrorModel({msg:'文件未找到'}))
    return;
   } 
   let file_name = pathName;

  let result = await getFile(file_name);

  if(result.length ===0){
    response.json(new ErrorModel({msg:'文件未找到或已删除'}))
    return;
  }else{
    var filepath = path.join(__dirname,'../','uploads', pathName);
// 获取文件状态:
fs.stat(filepath, function (err, stats) {
  if (!err && stats.isFile()) {
      // 发送200响应:
      response.writeHead(200);
      // 将文件流导向response:
      fs.createReadStream(filepath).pipe(response);
  } else {
      // 出错了或者文件不存在:
      console.log('404 ' + request.url);
      // 发送404响应:
      response.writeHead(404);
      response.end('404 Not Found');
  }
});
  }
//   result.then(data=>{
//    console.log(data)
  
//    if(data.length==0){
//      response.json(new ErrorModel({msg:'文件未找到或已删除'}))
//      return;
//    }else{
//     var filepath = path.join(__dirname,'../','uploads', pathName);
// // 获取文件状态:
// fs.stat(filepath, function (err, stats) {
//   if (!err && stats.isFile()) {
//       // 发送200响应:
//       response.writeHead(200);
//       // 将文件流导向response:
//       fs.createReadStream(filepath).pipe(response);
//   } else {
//       // 出错了或者文件不存在:
//       console.log('404 ' + request.url);
//       // 发送404响应:
//       response.writeHead(404);
//       response.end('404 Not Found');
//   }
// });
    
//   }
//   }).catch((err) => {
//     return {
//       msg: err.sqlMessage,
//     };
//   });
 
})
router.post('/update',(req,res,next)=>{
  const result = updateFile(req.body);
  return result.then((data) => {
   
    if (!data) {
      res.json(new ErrorModel(data));
      return;
    }
    res.json(new SuccessModel(data));
  }).catch(err=>{
    res.json(new ErrorModel(err));
  });
})
router.get('/get',(req,res)=>{

  let {file_name,id,module_id,module_name,curPage} = req.query;
   let result = getFile(file_name,id,module_id,module_name,curPage);
   result.then((data) => {
    res.json(new SuccessModel(data, data.totalPageNum));
     });
})
router.post('/upload',upload.array("files"),(req,res,next)=>{

    let fileList = [];
  if(!req.files){

    res.json(new ErrorModel({msg:'没有文件!'}));
  }
 
    req.files.map((elem) => {
   
        if(req.body.module_id && req.body.module_name && req.body.file_usage){
          
          fileList.push({
            module_id:req.body.module_id,
            module_name:req.body.module_name,
            originalname: elem.originalname,
            file_name:changedName,
            file_url:'http://' + '10.37.53.62:8000' + '/api/edu/files/show?file_name=' + changedName,
            suffix:elem.originalname.split('.')[1],
            file_type:elem.mimetype.split('/')[0],
            file_usage:req.body.file_usage
        })
      
 
        }else{
          
          res.json(new ErrorModel({msg:'缺少参数'}));
        
        }
    });
    if(!req.body.module_id && !req.body.module_name && !req.body.file_usage){
      res.json(new ErrorModel({msg:'缺少参数'}));
    }else{
      
      let result = createFile(fileList)
      console.log(result)
      res.json(new SuccessModel(result));
    }
    
  
})
router.post('/del',(req,res)=>{
  const result = delFile(req.body.id);
    return result.then((val) => {
      if (val) {
        res.json(new SuccessModel(val));
      } else {
        res.json(new ErrorModel("删除文件失败"));
      }
    }).catch(err=>{
      res.json(new ErrorModel(err));
    });
})
module.exports = router;