const { exec } = require("../db/mysql");


const getModule = (name)=>{
    let sql = `select * from module where 1=1 and is_deleted=${0} `;
    if (name) {
        sql += `and name='${name}' `;
      }
      return exec(sql);
}

module.exports = {
    getModule
}