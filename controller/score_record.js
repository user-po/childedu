const { exec } = require("../db/mysql");
const xss = require("xss");
const strReplace = require("../middleware/strReplace");
const { pageSize } = require("../conf/page");
const FULL_SCORE = 10;
const getScore= async (studentId,relation_id,id,curPage=1)=>{
    let sql = `select score_record.*,course.name as course_name from score_record 
               left join relationship on relationship.id = score_record.relation_id
               left join course on  course.id = relationship.course_id  
    where 1=1 and score_record.is_deleted=${0} and relationship.is_deleted=${0} and course.is_deleted=${0}
    `;
    if (id) {
        sql += `and id='${id}' `;
      }
      if (relation_id) {
        sql += `and relation_id='${relation_id}' `;
      }
      if (studentId) {
        sql += `and studentId='${studentId}' `;
      }
     // let sql_count = sql.replace("*", "count(*)");
      sql += `limit ${(curPage - 1) * pageSize},${pageSize}`;
      //console.log(sql)
      //const totalPageNum = await exec(sql_count);
      const res = await exec(sql);
      res.totalPageNum = Math.floor((res.length+pageSize -1)/pageSize);
    
      return new Promise((resolve) => {
        resolve(res);
      });
}
const createScore = async (data)=>{
  let reqArr = [];
   for(let item of data){
     console.log(item)
    let {studentId,relation_id,score_list,is_up_to_standard,is_advice,analysis,special_record,is_parent_implement,is_teacher_implement,gpa=0.0,rank} =item;
    if(typeof(studentId)==='undefined' || typeof(relation_id)==='undefined' || typeof(score_list)==='undefined' || typeof(is_up_to_standard)==='undefined' || typeof(rank)==='undefined'){
      return new Promise(reject=>{
        reject({
          msg: '参数不全'
        })
      })
    }
    if(typeof(analysis)==='undefined'){
      analysis=null
    }
    if(typeof(special_record)==='undefined'){
      special_record=null
    }
    let sql = `insert into score_record(studentId,relation_id,score_list,gpa,is_up_to_standard,is_advice,analysis,special_record,rank,is_parent_implement,is_teacher_implement) values(${studentId},${relation_id},'${score_list}',${gpa},'${is_up_to_standard}','${is_advice}','${analysis}','${special_record}',${rank},'${is_parent_implement}','${is_teacher_implement}')`
    reqArr.push(exec(sql))
     
   }
   const res = await Promise.all(reqArr)
   return res
}
const updateScore= (data)=>{
    let {id,studentId,relation_id,score_list,is_up_to_standard,is_advice,analysis,special_record,is_parent_implement,is_teacher_implement} =data;
    if(typeof(id)==='undefined'){
      return new Promise(reject=>{
        reject({
          msg: '参数不全'
        })
      })
    }
    let gpa= 0.0;
    let sql = `update score_record set `;

    if (studentId) {
        sql += `studentId='${studentId}',`;
      }
      if (relation_id) {
        sql += `relation_id='${relation_id}',`;
      }
      if (score_list) {
        // let total = score_list.split(',').reduce((x,y)=>{
    
        //     return parseInt(x)+parseInt(y);
        //    })
        //    let length = score_list.split(',').length;
       
        //     gpa = total / (FULL_SCORE*length) * 100
           
        sql += `score_list='${score_list}'`;
        
      }
      if (gpa) {
        // let total = score_list.split(',').reduce((x,y)=>{
    
        //     return parseInt(x)+parseInt(y);
        //    })
        //    let length = score_list.split(',').length;
       
        //     gpa = total / (FULL_SCORE*length) * 100
           
        sql += `gpa=${gpa}`;
        
      }
      if (typeof(is_up_to_standard)!=='undefined') {
        sql += `is_up_to_standard='${is_up_to_standard}',`;
      }
      if (typeof(is_advice)!=='undefined') {
        sql += `is_advice='${is_advice}',`;
      }
      if (analysis) {
        sql += `analysis='${analysis}',`;
      }
      if (special_record) {
        sql += `special_record='${special_record}',`;
      }
      if (typeof(is_parent_implement)!=='undefined') {
        sql += `is_parent_implement='${is_parent_implement}',`;
      }
      if (typeof(is_teacher_implement)!=='undefined') {
        sql += `is_teacher_implement='${is_teacher_implement}',`;
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
const delScore = (id)=>{
  if(typeof(id)==='undefined'){
    return new Promise(reject=>{
      reject({
        msg: '参数不全'
      })
    })
  }
    const sql = `update score_record set is_deleted=${1} where id=${id}`;
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
const getScoreRank  =(data)=>{

}
module.exports = {
    getScore,
    createScore,
    updateScore,
    delScore,
    getScoreRank
}