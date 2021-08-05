const { exec } = require("../db/mysql");
const xss = require("xss");
const strReplace = require("../middleware/strReplace");
const { pageSize } = require("../conf/page");


const createFile = (fileList)=>{


  
  for(let item of fileList){
    let sql = `insert into file_storage(module_id,module_name,file_name,file_url,suffix,file_type,file_usage) values(${item.module_id},'${item.module_name}','${item.file_name}','${item.file_url}','${item.suffix}','${item.file_type}','${item.file_usage}')`;
    
    exec(sql).then(data=>{
      
    })
    .catch(err=>{
        return {
            msg: err.sqlMessage,
          };
    })
  }
  
  return { 
    msg:'上传成功!',
    files:fileList
  }
}
const getFile= async (file_name,id,module_id,module_name,curPage=1)=>{
    let sql = `select * from file_storage where 1=1 and is_deleted=${0} `;
   
    if (file_name) {
        sql += `and file_name='${file_name}' `;
      }
      if (module_id) {
        sql += `and module_id=${module_id} `;
      }
      if (id) {
        sql += `and id='${id}' `;
      }
      if (module_name) {
        sql += `and module_name='${module_name}' `;
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
const updateFile = (data)=>{
   let {id,module_id,module_name,file_name,file_url,suffix,file_type,file_usage} = data;
   if(!id){
    return new Promise(reject=>{
      reject({
        msg: '参数不全'
      })
    })
  }
   let sql = `update file_storage set `;
  
   if (module_id) {
       sql += `module_id='${module_id}',`;
     }
     if (module_name) {
       sql += `module_name='${module_name}',`;
     }
     if (file_name) {
       sql += `file_name='${file_name}',`;
     }
     if (suffix) {
       sql += `suffix='${suffix}',`;
     }
     if (file_type) {
        sql += `file_type='${file_type}',`;
      }
      if (file_usage) {
        sql += `file_usage='${file_usage}',`;
      }
      if (file_url) {
        sql += `file_url='${file_url}',`;
      }
      if(id){
        sql += `where id=${id} and is_deleted=${0}`;
      }
      sql = strReplace(sql, sql.indexOf("where") - 1, " ");
      return exec(sql).then((res) => {
          
        if (res.affectedRows > 0) {
           return true;
        }else{
            return false;
        }
      })
}
const delFile=(id)=>{
  if(!id){
    return new Promise(reject=>{
      reject({
        msg: '参数不全'
      })
    })
  }
    const sql = `update file_storage set is_deleted=${1} where id=${id}`;
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
module.exports={
  createFile,
  delFile,
  updateFile,
  getFile
}

