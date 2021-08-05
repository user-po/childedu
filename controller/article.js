const { exec } = require("../db/mysql");
const xss = require("xss");
const strReplace = require("../middleware/strReplace");
const { pageSize } = require("../conf/page");

const getArticle = async (
  module_code,
  module_id,
  title,
  release_time,
  issuer,
  is_recommend,
  modified_time,
  play_count,
  curPage = 1,
  userType,
  userId
) => {
  let sql = `select * from article where 1=1 and is_deleted=${0} `;

  if(typeof(userType)==='undefined' || typeof(userId) === 'undefined'){
    return new Promise(reject=>{
      reject({
         msg: '参数不全'
      })
   })
  }

  if(userType && userId){
    sql+=`and user_type='${userType}' and user_id=${userId} `
  }
  if (module_code) {
    sql += `and module_code='${module_code}' `;
  }
  if (module_id) {
    sql += `and module_id='${module_id}' `;
  }
  if (title) {
    sql += `and title like '%${title}%' `;
  }
  if (release_time) {
    sql += `and release_time like '%${release_time}%' `;
  }
  if (issuer) {
    sql += `and issuer='${issuer}' `;
  }
  if (is_recommend) {
    sql += `and is_recommend='${is_recommend}' `;
  }
  if (modified_time) {
    sql += `and modified_time='${modified_time}' `;
  }
  if (play_count) {
    sql += `and play_count='${play_count}' `;
  }
  let sql_count = sql.replace("*", "count(*)");
  sql += `limit ${(curPage - 1) * pageSize},${pageSize}`;
  const totalPageNum = await exec(sql_count);
  const res = await exec(sql);
  res.totalPageNum = Math.floor((totalPageNum[0]["count(*)"]+pageSize-1)/pageSize);
  return new Promise((resolve) => {
    resolve(res);
  });
};
const createArticle = (data) => {
  let {
    module_code,
    module_id,
    title,
    issuer,
    is_recommend,
    article_type_code,
    article_type_name,
    content,
  } = data;
  if (
    typeof module_code === "undefined" ||
    typeof module_id === "undefined" ||
    typeof title === "undefined" ||
    typeof issuer === "undefined" ||
    typeof is_recommend === "undefined" ||
    typeof article_type_code === "undefined" ||
    typeof article_type_name === "undefined" ||
    typeof content === "undefined"
  ) {
    return new Promise((reject) => {
      reject({
        msg: "参数不全",
      });
    });
  }
  let sql = `insert into article(module_code,module_id,article_type_code,article_type_name,title,content,issuer,is_recommend) values('${module_code}',${module_id},${article_type_code},'${article_type_name}','${title}','${content}','${issuer}','${is_recommend}')`;

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
const updateArticle = (data) => {
  let {
    id,
    module_code,
    module_id,
    title,
    issuer,
    is_recommend,
    article_type_code,
    article_type_name,
    content,
  } = data;
  if (typeof id === "undefined") {
    return new Promise((reject) => {
      reject({
        msg: "参数不全",
      });
    });
  }
  let sql = `update article set `;
  if (module_code) {
    sql += `module_code='${module_code}',`;
  }
  if (module_id) {
    sql += `module_id=${module_id},`;
  }
  if (issuer) {
    sql += `issuer='${issuer}',`;
  }
  if (is_recommend !== undefined) {
    sql += `is_recommend='${is_recommend}',`;
  }
  if (article_type_code) {
    sql += `article_type_code=${article_type_code},`;
  }
  if (article_type_name) {
    sql += `article_type_name='${article_type_name}',`;
  }
  if (title) {
    sql += `title='${title}',`;
  }
  if (content) {
    sql += `content='${content}',`;
  }
  if (id) {
    sql += `where id=${id} and is_deleted=${0}`;
  }
  sql = strReplace(sql, sql.indexOf("where") - 1, " ");

  return exec(sql)
    .then((res) => {
      if (res.affectedRows > 0) {
        return true;
      }
      return false;
    })
    .catch((err) => {
      return {
        msg: err.sqlMessage,
      };
    });
};
const delArticle = (id) => {
  if (typeof id === "undefined") {
    return new Promise((reject) => {
      reject({
        msg: "参数不全",
      });
    });
  }
  const sql = `update article set is_deleted=${1} where id=${id}`;
  return exec(sql)
    .then((res) => {
      if (res.affectedRows > 0) {
        return true;
      }
      return false;
    })
    .catch((err) => {
      return {
        msg: err.sqlMessage,
      };
    });
};
module.exports = {
  getArticle,
  createArticle,
  updateArticle,
  delArticle,
};
