const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
var FileStreamRotator = require("file-stream-rotator");
var bodyParser = require('body-parser');
const app = express();
const studentRouter = require('./routes/student');
const teacherRouter = require('./routes/teacher');
const classRouter = require('./routes/class');
const origanizationRouter = require('./routes/organizational')
const  courseRouter= require('./routes/course')
const articleRouter = require('./routes/article')
const fileRouter = require('./routes/fileStorage');
const measuresRouter = require('./routes/measures')
const measuresWorkableRouter = require('./routes/measures_workable')
const relationshipRouter = require('./routes/relationShip')
const scoreRouter  = require('./routes/score_record');
const studentWorkRouter = require('./routes/student_work_record')
const userRouter = require('./routes/user')
const moduleRouter = require('./routes/module');
//设置跨域访问
app.all("*", function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
 	  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');  
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization'); 
    res.setHeader('Content-type','text/html;charset=utf-8')
  //   访问权交给下一个中间件
  next();
});
// const ENV = process.env.NODE_ENV;
const logFileName = path.join(__dirname, "log");
const writeStream = FileStreamRotator.getStream({
  date_format: "YYYYMMDD", //日期类型
  filename: path.join(logFileName, "%DATE%-access.log"), //文件名
  frequency: "daily", //每天的频率
  verbose: false,
});
// let dbStream = {
//   write: function (line) {
//     saveToDatabase(line); // 伪代码，保存到数据库
//   },
// };
app.use(logger("combined", { stream: writeStream }));
//获取post请求数据
 app.use(express.json());
// //url encoded模式
 app.use(express.urlencoded({ extended: false }));
// 使用中间件
//app.use(bodyParser.json()) // 支持 json 格式
// 使用第三方插件 qs 来处理
//app.use(bodyParser.urlencoded({extended : true}))
app.use(cookieParser());
app.use('/api/edu/student',studentRouter)
app.use('/api/edu/teacher',teacherRouter)
app.use('/api/edu/class',classRouter)
app.use('/api/edu/organization',origanizationRouter)
app.use('/api/edu/course',courseRouter)
app.use('/api/edu/article',articleRouter)
app.use('/api/edu/files',fileRouter)
app.use('/api/edu/measures',measuresRouter)
app.use('/api/edu/measuresWorkable',measuresWorkableRouter)
app.use('/api/edu/relationship',relationshipRouter)
app.use('/api/edu/score',scoreRouter)
app.use('/api/edu/studentWork',studentWorkRouter)
app.use('/api/edu/module',moduleRouter)
app.use('/api/edu/user',userRouter)
// const redisClient = require("./db/redis");
// const sessionStore = new RedisStore({
//   client: redisClient,
// });
// app.use(
//   session({
//     secret: "WJiol_1234#",
//     cookie: {
//       path: "/", //默认配置
//       httpOnly: true, //默认配置
//       maxAge: 24 * 60 * 60 * 1000,
//     },
//     store: sessionStore,
//   })
// );
//app.use(express.static(path.join(__dirname,'../', "uploads")));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;
