const { exec } = require("../db/mysql");
const xss = require("xss");
const strReplace = require("../middleware/strReplace");
const { pageSize } = require("../conf/page");

function getWorkCode() {
    var orderCode = "";
    for (
      var i = 0;
      i < 5;
      i++ //6位随机数，用以加在时间戳后面。
    ) {
      orderCode += Math.floor(Math.random() * 10);
    }
    orderCode = new Date().getTime() + orderCode; //时间戳，用来生成订单号。
   
    return orderCode;
  }
const getStudentWork = async (id,student_id,relation_id,curPage=1)=>{
    let sql = `select * from student_work_record where 1=1 and is_deleted=${0} `;
    if (id) {
        sql += `and id='${id}' `;
      }
      if(student_id){
        sql += `and student_id=${student_id} `;
      }
      if(relation_id){
        sql += `and relation_id=${relation_id} `;
      }
      let sql_count = sql.replace("*", "count(*)");
      sql += `limit ${(curPage - 1) * pageSize},${pageSize}`;
      const totalPageNum = await exec(sql_count);
      const res = await exec(sql);
      res.totalPageNum = Math.floor((totalPageNum[0]["count(*)"]+pageSize-1)/pageSize);
    
      return new Promise((resolve) => {
        resolve(res);
      });
}
const createStudentWork = (data)=>{

    let {student_id,relation_id,is_completed,is_upload_word,word,is_upload_video,video_num} = data
    if(typeof(student_id)==='undefined' || typeof(relation_id)==='undefined'){
      return new Promise(reject=>{
        reject({
          msg: '参数不全'
        })
      })
    }
    if(word){
       is_upload_word=1;
    }
    if(typeof(word)==='undefined'){
       word = ''
    }
    if(typeof(is_completed)==='undefined'){
        is_completed=0;
    }
    if(typeof(is_upload_word)==='undefined'){
        is_upload_word=0;
    }
    if(typeof(is_upload_video)==='undefined'){
        is_upload_video=0;
    }
    if(typeof(video_num)==='undefined'){
        video_num=0;
    }
    let sql = `insert into student_work_record(student_id,relation_id,is_completed,is_upload_word,word,is_upload_video,video_num) values('${student_id}',${relation_id},'${is_completed}','${is_upload_word}','${word}','${is_upload_video}',${video_num})`
   
    return exec(sql)
    .then((res) => {
      if (res.insertId) {
        return {
          id: res.insertId,
        };
      }
    })
    .catch((err) => {
      return {
        msg: err.sqlMessage,
      };
    });
}
const updateStudentWork=(data)=>{
   let {student_id,relation_id,is_completed,is_upload_word,word,is_upload_video,video_num,id} = data
   if(typeof(id)==='undefined'){
    return new Promise(reject=>{
      reject({
        msg: '参数不全'
      })
    })
   }
   let sql = `update student_work_record set `;
  if (student_id) {
    sql += `student_id='${student_id}',`;
  }
  if (relation_id) {
    sql += `relation_id='${relation_id}',`;
  }
  if (typeof(is_completed)!=='undefined') {
    sql += `is_completed='${is_completed}',`;
  }
  if (typeof(is_upload_word)!=='undefined') {
    sql += `is_upload_word='${is_upload_word}',`;

  }
  if (word) {
      
    sql += `word='${word}',is_upload_word=${1}`;
    
  }
  if (typeof(is_upload_video)!=='undefined') {
      
    sql += `is_upload_video='${is_upload_video}',`;
    
  }
  if(video_num){
    sql += `video_num='${video_num}',is_upload_video=${1},`;
  }
  if(id){
    sql += `where id=${id} and is_deleted=${0}`;
  }
  sql = strReplace(sql, sql.indexOf("where") - 1, " ");
  return exec(sql).then((res) => {
    if (res.affectedRows > 0) {
      return true;
    }
    return false;
  }).catch(err=>{
    return {
      msg: err.sqlMessage,
    };
  });

}
const delStudentWork=(id)=>{
  if(typeof(id)==='undefined'){
    return new Promise(reject=>{
      reject({
        msg: '参数不全'
      })
    })
   }
    const sql = `update student_work_record set is_deleted=${1} where id=${id}`;
    return exec(sql).then((res) => {
      if (res.affectedRows > 0) {
        return true;
      }
      return false;
    }).catch(err=>{
      return {
        msg: err.sqlMessage,
      };
    });
}
const getDetail = (data)=>{
   let {
     homeWorkId
   } = data;

   let sql = `select * from student_work_record 
   left join file_storage on student_work_record.id = file_storage.module_id  
   where student_work_record.id=${homeWorkId} and file_storage.module_name='student_work_record' and file_storage.is_deleted=${0} and student_work_record.is_deleted=${0} `;

   return exec(sql);

}
module.exports = {
    getStudentWork,
    createStudentWork,
    updateStudentWork,
    delStudentWork,
    getDetail
}