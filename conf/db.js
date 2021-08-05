const env = process.env.NODE_ENV; // 环境参数

let MYSQL_CONF = {};
let REDIS_CONF = {};
if (env === "dev") {
  MYSQL_CONF = {
    host: "10.12.0.158",
    user: "root",
    password: "123456",
    port: "3306",

    database: "childeduction",
    dateStrings : true //解决时间格式
  };
  //redis
  REDIS_CONF = {
    port: 6379,
    host: "127.0.0.1",
  };
}

if (env === "production") {
  MYSQL_CONF = {
    host: "jiafei1.wicp.vip",
    user: "root",
    password: "123456",
    port: "56695",
    database: "childeduction",
  dateStrings : true //解决时间格式
  };
  //redis
  REDIS_CONF = {
    port: 6379,
    host: "127.0.0.1",
  };
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF,
};
