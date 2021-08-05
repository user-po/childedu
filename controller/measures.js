const { exec } = require("../db/mysql");
const xss = require("xss");
const strReplace = require("../middleware/strReplace");
const { pageSize } = require("../conf/page");


const getMeasures= async (id,score_id,curPage=1)=>{
    
    let sql = `select * from measures where 1=1 and is_deleted=${0} `;
   
    if (id) {
        sql += `and id='${id}' `;
      }
      if (score_id) {
        sql += `and score_id=${score_id} `;
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
const createMeasures = (data)=>{
     let {score_id,role,measures_for_details} =data;
     if(typeof(score_id)==='undefined' || typeof(role)==='undefined' || typeof(measures_for_details) === 'undefined'){
      
          return new Promise(reject=>{
            reject({
              msg: '参数不全'
            })
          })
        
     }
     let sql = `insert into measures(score_id,role,measures_for_details) values(${score_id},'${role}','${measures_for_details}')`
     
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
const updateMeasures = (data)=>{
    let {score_id,role,measures_for_details,id} =data;
    if(typeof(id)==='undefined'){
      return new Promise(reject=>{
        reject({
          msg: '参数不全'
        })
      })
    }
    let sql = `update measures set `;
   
    if (score_id) {
        sql += `score_id='${score_id}',`;
      }
      if (role) {
        sql += `role='${role}',`;
      }
      
      if (measures_for_details) {
        sql += `measures_for_details='${measures_for_details}',`;
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
const delMeasures=(id)=>{
    const sql = `update measures set is_deleted=${1} where id=${id}`;
    if(typeof(id)==='undefined'){
      return new Promise(reject=>{
        reject({
          msg: '参数不全'
        })
      })
    }
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
const getDetail =(data)=>{
   let {
     measureId
   } = data;
 
   let sql = `select * from measures 
   left join score_record on measures.score_id = score_record.id left join measures_workable on measures.id = measures_workable.measures_id 
   left join file_storage on file_storage.module_id = measures.id 
   where measures.id=${measureId} and measures_workable.role='家长' and file_storage.module_name='measures' 
   and measures.is_deleted=${0} and score_record.is_deleted=${0} and measures_workable.is_deleted=${0} and file_storage.is_deleted=${0}`
   
   return exec(sql)
}
module.exports = {
    getMeasures,
    createMeasures,
    updateMeasures,
    delMeasures,
    getDetail
}