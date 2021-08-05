const { exec } = require("../db/mysql");
const xss = require("xss");
const { SuccessModel, ErrorModel } = require("../model/resModel");
const strReplace = require("../middleware/strReplace");
const { pageSize } = require("../conf/page");
function genClassCode() {
  var orderCode = "";
  for (
    var i = 0;
    i < 6;
    i++ //6位随机数，用以加在时间戳后面。
  ) {
    orderCode += Math.floor(Math.random() * 10);
  }
  orderCode = new Date().getTime() + orderCode; //时间戳，用来生成订单号。
  return orderCode;
}
const getClass = async (teacherId,classNum, class_no, grade, curPage=1,viceTeacherId,babySitterId,organiaztionalId,headMasterId) => {
  let sql = `select * from class where 1=1 and is_deleted=${0} `;
  let sql_teacher = `select * from class left join teacher on class.teacher_id=teacher.id`;
 
  if (teacherId) {
    sql += `and teacher_id='${teacherId}' `;
  }
  if(headMasterId){
    sql += `and headmaster_id='${headMasterId}' `;
  }
  if (classNum) {
    sql += `and class='${classNum}' `;
  }
  if (class_no) {
    sql += `and class_no='${class_no}' `;
  }
  if (grade) {
    sql += `and grade='${grade}' `;
  }
  if (viceTeacherId) {
    sql += `and viceTeacherId=${viceTeacherId} `;
  }
  if (babySitterId) {
    sql += `and babySitterId=${babySitterId} `;
  }
  if(organiaztionalId){
    sql+=`and organizational_id=${organiaztionalId} `
  }
  let sql_count = sql.replace('*','count(*)')
  const totalPageNum = await exec(sql_count)
  sql += `limit ${(curPage - 1) * pageSize},${pageSize}`;
  
  const res = await exec(sql_teacher);

  const res_class =  await exec(sql);
  res_class.teachers = res;

  res_class.totalPageNum = Math.floor((totalPageNum[0]["count(*)"]+pageSize-1)/pageSize);
  return new Promise(resolve=>{
    resolve(res_class)
  })
};
const createClass = (data) => {
  const { grade, classNum, remark, teacherId, organizational_id,class_no,headMasterId,viceTeacherId,babySitterId} = data;
  if(typeof(class_no)==='undefined'){
    class_no =genClassCode()
  }
  if(typeof(grade)==='undefined' || typeof(classNum)==='undefined' || typeof(teacherId)==='undefined' || typeof(organizational_id)==='undefined'||typeof(headMasterId)==='undefined'||typeof(viceTeacherId)==='undefined'||typeof(babySitterId)==='undefined'){
    return new Promise(reject=>{
      reject({
         msg: '参数不全'
      })
   })
  }
  const sql = `insert into class(teacher_id,grade,class,class_no,remark,organizational_id,headmaster_id,viceTeacherId,babySitterId) values(${teacherId},'${grade}','${classNum}','${class_no}','${remark}',${organizational_id},${headMasterId},${viceTeacherId},${babySitterId})`;
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
};
const updateClass = (data) => {
  const { grade, className, remark, id,class_no } = data;
  if(typeof(id)==='undefined'){
    return new Promise(reject=>{
      reject({
         msg: '参数不全'
      })
   })
  }
  let sql = `update class set `;

  if (grade) {
    sql += `grade='${grade}',`;
  }
  if (className) {
    sql += `class='${className}',`;
  }
  if (class_no) {
    sql += `class_no='${class_no}',`;
  }
  if (remark) {
    sql += `remark='${remark}',`;
  }
  if(id){
    sql += `where id=${id} and is_deleted=${0}`;
  }
  sql = strReplace(sql, sql.indexOf("where") - 1, " ");
  return exec(sql).then((res) => {
    if (res.affectedRows > 0) {
      return true;
    }
  }).catch(err=>{
    return {
      msg: err.sqlMessage,
    };
  })
};
const delClass = (id) => {
  if(typeof(id)==='undefined'){
    return new Promise(reject=>{
      reject({
         msg: '参数不全'
      })
   })
  }
  const sql = `update class set is_deleted=${1} where id=${id}`;

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
};
const getAllStudents = (data)=>{
    let {
      classId,
    } = data;

    if(typeof(classId) === 'undefined'){
      return new Promise(reject=>{
        reject({
           msg: '参数不全'
        })
     })
    }

    let sql = `
         select class.id,student.* from class left join
         student on class.id = student.class_id where class.id = ${classId} and student.is_deleted=${0}`
        
  return exec(sql)
}
module.exports = {
  getClass,
  delClass,
  createClass,
  updateClass,
  getAllStudents
};
