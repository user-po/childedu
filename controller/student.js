const { exec } = require("../db/mysql");
const xss = require("xss");
const strReplace = require("../middleware/strReplace");
const { pageSize } = require("../conf/page");
function getStuCode() {
  var orderCode = "";
  for (
    var i = 0;
    i < 7;
    i++ //6位随机数，用以加在时间戳后面。
  ) {
    orderCode += Math.floor(Math.random() * 10);
  }
  orderCode = new Date().getTime() + orderCode; //时间戳，用来生成订单号。

  return orderCode;
}
const getStudent = async (
  studentName,
  classLevel,
  grade,
  sex,
  ageBefore,
  ageAfter,
  stuCode,
  curPage=1
) => {
  let sql = `select * from student where 1=1 and is_deleted=${0} `;
  if (studentName) {
    sql += `and name='${studentName}' `;
  }
  if (classLevel) {
    sql += `and class='${classLevel}' `;
  }
  if (grade) {
    sql += `and grade='${grade}' `;
  }
  if (sex) {
    sql += `and sex='${sex}' `;
  }
  if (ageBefore) {
    sql += `and age>=${ageBefore} `;
  }
  if (ageAfter) {
    sql += `and age<=${ageAfter} `;
  }
  if (stuCode) {
    sql += `and stuCode='${stuCode}' `;
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
async function createStudent(data) {
  const {
    name,
    sex,
    Intake,
    grade,
    classLevel,
    class_no,
    birth,
    age,
    address,
    lng,
    lat,
    admin_code,
    parent_name,
    parent_phone,
    remark,
    class_id,
    stuCode
  } = data;
  
   if(typeof(name)==='undefined' || typeof(sex)==='undefined' || typeof(Intake)==='undefined' || typeof(grade)==='undefined' || typeof(classLevel)==='undefined' || typeof(class_no)==='undefined' || typeof(birth)==='undefined' || typeof(age)==='undefined' || typeof(address)==='undefined' || typeof(lng)==='undefined' || typeof(lat)==='undefined' || typeof(admin_code)==='undefined' || typeof(parent_name)==='undefined' || typeof(parent_phone)==='undefined' || typeof(class_id)==='undefined' || typeof(stuCode)==='undefined'){
    return new Promise(reject=>{
      reject({
        msg: '参数不全'
      })
    })
   }
    //let stuCode=getStuCode()
  
  const sql = `insert into student(class_id,grade,class,class_no,stuCode,name,Intake,birth,age,sex,address,lng,lat,admin_code,parent_name,parent_phone,remark) values(${class_id},'${grade}','${classLevel}','${class_no}','${stuCode}','${name}','${Intake}','${birth}',${age},${sex},'${address}','${lng}','${lat}','${admin_code}','${parent_name}','${parent_phone}','${remark}')`;
  const sql_num = `select class_people_num from class where id=${class_id}`;
  const sql_sel_orId = `select organizational_id from class where id=${class_id}`
  let num = "";
  let orId_num = "";
  let stu_num="";
  try {
    num = await exec(sql_num);
    orId_num = await exec(sql_sel_orId);
  } catch (error) {
    return {
      msg: "新建失败!请检查入参是否完整",
    };
  }
  const sql_sel_stuNum = `select student_num from organizational where id=${orId_num[0]['organizational_id']}`
  try {
    stu_num = await exec(sql_sel_stuNum);
  } catch (error) {
    return {
      msg: "新建失败!请检查入参是否完整",
    };
  }
  stu_num[0]['student_num']+=1;
  const sql_up_stuNum = `update organizational set student_num=${stu_num[0]['student_num']} where id=${orId_num[0]['organizational_id']}`;
  try {
    await exec(sql_up_stuNum)
  } catch (error) {
    return {
      msg: "新建失败!请检查入参是否完整",
    };
  }
  num[0]["class_people_num"] += 1;
  let sql_in_num = `update class set class_people_num=${
    num[0]["class_people_num"]
  } where id=${class_id} and is_deleted=${0}`;
  let res = "";
  try {
    res = await exec(sql);
  } catch (error) {
    return {
      msg: err.sqlMessage,
    };
  }
  if (res.insertId) {
    await exec(sql_in_num);
  }
  return {
    id: res.insertId,
  };
}
function updateStudent(data) {
  const {
    name,
    sex=0,
    Intake,
    grade,
    classLevel,
    class_no,
    birth,
    age,
    address,
    lng,
    lat,
    admin_code,
    parent_name,
    parent_phone,
    remark,
    class_id,
    id,
  } = data;
  if(typeof(id)==='undefined'){
    return new Promise(reject=>{
      reject({
        msg: '参数不全'
      })
    })
  }
  let sql = `update student set `;
  if (name) {
    sql += `name='${name}',`;
  }
  if(sex!==undefined){
    sql += `sex=${sex},`;
  }
  
  
  if (grade) {
    sql += `grade='${grade}',`;
  }
  if (classLevel) {
    sql += `class='${classLevel}',`;
  }
  if (Intake) {
    sql += `Intake='${Intake}',`;
  }
  if (class_no) {
    sql += `class_no='${class_no}',`;
  }
  if (birth) {
    sql += `birth='${birth}',`;
  }
  if (age) {
    sql += `age='${age}',`;
  }
  if (address) {
    sql += `address='${address}',`;
  }
  if (admin_code) {
    sql += `admin_code=${admin_code},`;
  }
  if (parent_name) {
    sql += `parent_name='${parent_name}',`;
  }
  if (parent_phone) {
    sql += `parent_phone='${parent_phone}',`;
  }
  if (remark) {
    sql += `remark='${remark}',`;
  }
  if (class_id) {
    sql += `class_id=${class_id},`;
  }
  if (lng) {
    sql += `lng='${lng}',`;
  }
  if (lat) {
    sql += `lat='${lat}',`;
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
function delStudent(id) {
  if(typeof(id)==='undefined'){
    return new Promise(reject=>{
      reject({
        msg: '参数不全'
      })
    })
  }
  const sql = `update student set is_deleted=${1} where id=${id}`;

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
function getQualifiedScores(data){
  let {
    studentId,
    curPage=1
  } = data;
  if(typeof(studentId)==='undefined'){
    return new Promise(reject=>{
      reject({
        msg: '参数不全'
      })
    })
  }
  let sql =`select score_record.*,course.*,student_work_record.id as homeWorkId 
  from score_record 
  left join relationship on score_record.relation_id = relationship.id 
  left join student on score_record.studentId = student.id
  where score_record.is_up_to_standard=${1} 
  and score_record.is_deleted=${0} and relationship.is_deleted=${0} and student.is_deleted=${0}  and score_record.studentId=${studentId}`;
  
  return exec(sql);


}
function getUnQualifiedScores(data){
  let {
    studentId
  } = data;
  if(typeof(studentId)==='undefined'){
    return new Promise(reject=>{
      reject({
        msg: '参数不全'
      })
    })
  }
  let sql =`select score_record.*,student.* from score_record 
  left join relationship on score_record.relation_id = relationship.id 
  left join student on score_record.studentId = student.id 
  where score_record.is_up_to_standard=${0} and score_record.is_deleted=${0} and relationship.is_deleted=${0} and student.is_deleted=${0} and score_record.studentId=${studentId}`;

  return exec(sql);
}
function getSocreRank(data){
  let {
     studentId
  } =data;
  let sql = `select * from score_record where studentId=${studentId}`;

  return exec(sql);
}
module.exports = {
  getStudent,
  createStudent,
  updateStudent,
  delStudent,
  getQualifiedScores,
  getUnQualifiedScores,
  getSocreRank
};
