const { exec } = require("../db/mysql");
const { ErrorModel } = require("../model/resModel");

module.exports = (tableName,params) => {
  let sql = `select count(*) from ${tableName} where 1=1 and is_deleted=${0}`;
  return exec(sql);
};
