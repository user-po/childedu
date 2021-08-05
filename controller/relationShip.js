const { exec } = require("../db/mysql");
const xss = require("xss");
const strReplace = require("../middleware/strReplace");
const { pageSize } = require("../conf/page");


const getRelationShip = async (id,course_id,organizational_id,curPage=1)=>{
    let sql = `select * from relationship where 1=1 and is_deleted=${0} and is_expires=${0} `;
    if (id) {
        sql += `and id='${id}' `;
      }
      if(course_id&&organizational_id){
        if (course_id) {
          sql += `and course_id=${course_id} and organizational_id=${organizational_id} `;
        }
      }else{
        if (course_id) {
          sql += `and course_id=${course_id} `;
        }
        if (organizational_id) {
          sql += `and organizational_id=${organizational_id} `;
        }
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
const  createRelationShip=(data)=>{
    for(let item of data){
      let {course_id,organizational_id,is_expires,course_no} = item;
    if(typeof(course_id)==='undefined' || typeof(organizational_id)==='undefined'){
      
      return new Promise(reject=>{
        reject({
          msg: '参数不全'
        })
      })
    }
    if(is_expires!==undefined){
        is_expires = 0;
    }
    if(!course_no){
        course_no=''
    }
    let sql = `insert into relationship(course_id,organizational_id,is_expires,course_no) values(${course_id},${organizational_id},'${is_expires}','${course_no}')`
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
}
const updateRelationShip = (data)=>{
    let {id,course_id,organizational_id,is_expires,course_no} = data;
    if(typeof(id)==='undefined'){
      return new Promise(reject=>{
        reject({
          msg: '参数不全'
        })
      })
    }
    let sql = `update relationship set `;
    
    if (course_id) {
        sql += `course_id='${course_id}',`;
      }
      if (organizational_id) {
        sql += `organizational_id='${organizational_id}',`;
      }
      if (is_expires!==undefined) {
        sql += `is_expires='${is_expires}',`;
      }
      if (course_no) {
        sql += `course_no='${course_no}',`;
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
      });;
}
const delRelationShip=(data)=>{
  console.log(data)
   for(let item of data){
    if(typeof(item.id)==='undefined'){
      return new Promise(reject=>{
        reject({
          msg: '参数不全'
        })
      })
    }
      const sql = `update relationship set is_deleted=${1} where id=${item.id}`;
      
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
}
module.exports = {
    getRelationShip,
    createRelationShip,
    updateRelationShip,
    delRelationShip
}