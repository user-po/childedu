const { exec } = require("../db/mysql");
const xss = require("xss");
const strReplace = require("../middleware/strReplace");
const { pageSize } = require("../conf/page");
function getCourseCode() {
    var orderCode = "";
    for (
      var i = 0;
      i < 8;
      i++ //6位随机数，用以加在时间戳后面。
    ) {
      orderCode += Math.floor(Math.random() * 10);
    }
    orderCode = new Date().getTime() + orderCode; //时间戳，用来生成订单号。
    
    return orderCode;
  }
const getCourse = async (id,code,name,curPage=1)=>{
    let sql = `select * from course where 1=1 and is_deleted=${0} `;
    if (id) {
        sql += `and id=${id} `;
      }
      if (code) {
        sql += `and code='${code}' `;
      }
      if (name) {
        sql += `and name='${name}' `;
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
const createCourse= (data)=>{
   
    
     for(let item of data){
      let {name,code,classLevel,types,course_no,index_list,is_red_list,remark} = item;

      if(!remark){
          remark = ''
      }
      if(!code){
         code = getCourseCode();
      }
      if(typeof(name)==='undefined' || typeof(classLevel)==='undefined' || typeof(types)==='undefined' || typeof(course_no)==='undefined' || typeof(index_list)==='undefined' || typeof(is_red_list)==='undefined'){
        return new Promise((resolve,reject)=>{
          reject({
            msg:'参数不全'
        })
      })
       
     
      }
        let sql =  `insert into course(name,code,class,types,course_no,index_list,is_red_list,remark) values('${name}','${code}','${classLevel}','${types}','${course_no}','${index_list}','${is_red_list}','${remark}')`;
        
         exec(sql)
     }
 
    return new Promise(resolve=>{
        resolve({
          msg:'插入成功'
      })
    })
}
const updateCourse=(data)=>{
    
    let {id,name,code,classLevel,types,course_no,index_list,is_red_list,remark} = data;
    if(typeof(id)==='undefined'){
      return new Promise(reject=>{
        reject({
           msg: '参数不全'
        })
     })
    }
    let sql = `update course set `;
    if (name) {
        sql += `name='${name}',`;
      }
      if (code) {
        sql += `code='${code}',`;
      }
      if (classLevel) {
        sql += `class='${classLevel}',`;
      }
      if (types) {
        sql += `types='${types}',`;
      }
      if (course_no) {
        sql += `course_no='${course_no}',`;
      }
      if (index_list) {
        sql += `index_list='${index_list}',`;
      }
      if (is_red_list!=='undefined') {
        sql += `is_red_list='${is_red_list}',`;
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
        return false;
      }).catch(err=>{
        return {
          msg: err.sqlMessage,
        };
      });
}
const delCourse = (id)=>{
  if(typeof(id)==='undefined'){
    return new Promise(reject=>{
      reject({
        msg: '参数不全'
      })
    })
  }
    const sql = `update course set is_deleted=${1} where id=${id}`;
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
const getCourseDetail = (data)=>{
  let  sql = `select course.*,
  score_record.id as score_id,
  score_record.studentId as student_id,
  score_record.relation_id as relationId,
  score_record.score_list as score_list,
  score_record.gpa as gpa,
  score_record.is_up_to_standard as is_up_to_standard,
  score_record.is_advice as is_advice,
  score_record.analysis as analysis,
  score_record.special_record as special_record,
  score_record.rank as rank,
  score_record.insert_time as insert_time,
  score_record.is_parent_implement as is_parent_implement,
  score_record.is_teacher_implement as is_teacher_implement
  from course 
  left join relationship on course.id = relationship.course_id 
  left join score_record on relationship.id = score_record.relation_id 
  where course.id=${data.course_id} and score_record.studentId=${data.studentId}
  and score_record.is_deleted=${0} and relationship.is_deleted=${0} and course.is_deleted=${0}
 `;

  return exec(sql);
}
module.exports = {
    getCourse,
    createCourse,
    updateCourse,
    delCourse,
    getCourseDetail
}