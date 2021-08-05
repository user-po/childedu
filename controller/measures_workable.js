const { exec } = require("../db/mysql");
const xss = require("xss");
const strReplace = require("../middleware/strReplace");
const { pageSize } = require("../conf/page");


const getWorkable = async (id,measures_id,curPage=1)=>{
    let sql = `select * from measures_workable where 1=1 and is_deleted=${0} `;
    if (id) {
        sql += `and id='${id}' `;
      }
      if (measures_id) {
        sql += `and measures_id='${measures_id}' `;
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
const createWorkable = (data)=>{
    
    let {measures_id,role,workable_detail,is_upload_video,is_upload_text,implement_list,complete_list}=data;
    if(typeof(is_upload_video)==='undefined'){
        is_upload_video=0;
    }
    if(typeof(is_upload_text)==='undefined'){
        is_upload_text=0;
    }
    if(workable_detail){
        is_upload_text=1;
    }
    if(typeof(measures_id)==='undefined' || typeof(workable_detail)==='undefined' || typeof(role)==='undefined' || typeof(implement_list)==='undefined' || typeof(complete_list)==='undefined'){
      return new Promise(reject=>{
        reject({
          msg: '参数不全'
        })
      })
    }
    let sql = `insert into measures_workable(measures_id,role,workable_detail,implement_list,complete_list,is_upload_video,is_upload_text) values(${measures_id},'${role}','${workable_detail}','${implement_list}','${complete_list}','${is_upload_video}','${is_upload_text}')`;
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
const updateWorkable = (data)=>{
    let {measures_id,role,workable_detail,is_upload_video,is_upload_text,id}=data;
    if(typeof(id)==='undefined'){
      return new Promise(reject=>{
        reject({
          msg: '参数不全'
        })
      })
    }
    let sql = `update measures_workable set `;
 
    if (measures_id) {
        sql += `measures_id='${measures_id}',`;
      }
      if (role) {
        sql += `role='${role}',`;
      }
      if (workable_detail) {
        sql += `workable_detail='${workable_detail}',is_upload_text=${1},`;
      }
      if (is_upload_video!==undefined) {
        sql += `is_upload_video='${is_upload_video}',`;
      }
      if (is_upload_text!==undefined) {
        sql += `is_upload_text='${is_upload_text}',`;
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
const delWorkable = (id)=>{
  if(typeof(id)==='undefined'){
    return new Promise(reject=>{
      reject({
        msg: '参数不全'
      })
    })
  }
    const sql = `update  measures_workable set is_deleted=${1} where id=${id}`;
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
module.exports = {
    getWorkable,
    createWorkable,
    updateWorkable,
    delWorkable
}