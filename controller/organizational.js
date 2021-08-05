const { exec } = require("../db/mysql");
const xss = require("xss");
const pinyin = require("tiny-pinyin");
const { pageSize } = require("../conf/page");
const strReplace = (str, index, char) => {
  const strAry = str.split("");
  strAry[index] = char;
  return strAry.join("");
};

const getOrganization = async (
  type,
  name,
  contact_people,
  province,
  city,
  area,
  curPage=1,
  address
) => {
  let sql = `select * from organizational where 1=1 and is_deleted=${0} `;
  if (type) {
    sql += `and type='${type}' `;
  }
  if (address) {
    sql += `and address='${address}' `;
  }
  if (name) {
    sql += `and name='${name}' `;
  }
  if (contact_people) {
    sql += `and contact_people='${contact_people}' `;
  }
  //   todo select by adminCode
  if (province) {
    sql += `and province='${province}' `;
  }
  if (city) {
    sql += `and city='${city}' `;
  }
  if (area) {
    sql += `and area='${area}'`;
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
const PrefixInteger = (num, length) => {
  return (Array(length).join("0") + num).slice(-length);
};
async function genCode(area, name,isUpdate,id) {
  if (!name || !area) {
    return;
  }
  let code = "";
  const sql = `select count(*) from organizational`;
  let code_data;
  let num
 if(id){
  const sql_sel_code =`select code from organizational where id=${id}`
  code_data = await exec(sql_sel_code);
  num = code_data[0]['code'].charAt(code_data[0]['code'].length-1)
 }
  const data = await exec(sql);
 
  
  if (pinyin.isSupported()) {
    name = pinyin.convertToPinyin(name); // WO
  }
  if(!isUpdate && !id){
    code = area + name + PrefixInteger(data[0]["count(*)"] + 1, 6);
  }else{
    code = area + name + PrefixInteger(parseInt(num), 6);
  }
  return code;
}
async function createOrganization(data) {
 
  let {
    name,
    contact_people,
    phone,
    type,
    remark,
    lng,
    lat,
    business_license,
    admin_code,
    province,
    city,
    area,
    address
  } = data;
  if(typeof(name)==='undefined' || typeof(contact_people)==='undefined' || typeof(phone)==='undefined' || typeof(type)==='undefined' || typeof(lng)==='undefined' || typeof(lat)==='undefined' || typeof(business_license)==='undefined' || typeof(admin_code)==='undefined' || typeof(province)==='undefined' || typeof(city)==='undefined' || typeof(area)==='undefined' || typeof(address)==='undefined'){
    return new Promise(reject=>{
      reject({
        msg: '参数不全'
      })
    })
  }
  const code = await genCode(area, name);
  const sql = `insert into organizational(type,name,contact_people,business_license,code,phone,admin_code,lng,lat,remark,province,city,area,address) values(${type},'${name}','${contact_people}','${business_license}','${code}','${phone}','${admin_code}','${lng}','${lat}','${remark}',${province},${city},${area},'${address}')`;
  
  let res = "";
  try {
    res = await exec(sql);
  } catch (err) {
    return {
      msg: err.sqlMessage,
    };
  }
  return {
    id: res.insertId,
  };
}
async function updateOrganization(data){
  let {
    name,
    contact_people,
    phone,
    type,
    remark,
    lng,
    lat,
    business_license,
    admin_code,
    province,
    city,
    area,
    id,
    address
  } = data;
  if(typeof(id)==='undefined'){
    return new Promise(reject=>{
      reject({
        msg: '参数不全'
      })
    })
  }
  let sql = `update organizational set `;

  if (name&&!area) {
    let sql_sel_area = `select area from organizational where id=${id}`;
    let area = await exec(sql_sel_area);
    let code = await genCode(area[0]['area'], name,true,id);
    sql += `name='${name}',code='${code}',`;
  }
  if (contact_people) {
    sql += `contact_people='${contact_people}',`;
  }
  if (phone) {
    sql += `phone='${phone}',`;
  }
  if (address) {
    sql += `address='${address}',`;
  }
  if (type) {
    sql += `type='${type}',`;
  }
  if (remark) {
    sql += `remark='${remark}',`;
  }
  if (lng) {
    sql += `lng='${lng}',`;
  }
  if (lat) {
    sql += `lat='${lat}',`;
  }
  if (business_license) {
    sql += `business_license='${business_license}',`;
  }
  if (admin_code) {
    sql += `admin_code=${admin_code},`;
  }
  if (province) {
    sql += `province=${province},`;
  }
  if (city) {
    sql += `city=${city},`;
  }
  if (area&&!name) {
    let sql_sel_name = `select name from organizational where id=${id}`;
    let name = await exec(sql_sel_name);
    let code = await genCode(area, name[0]['name'],true,id);
    sql += `area=${area},code='${code}',`;
  }
  if(area&&name){
    let code = await genCode(area, name,true,id);
    sql += `name='${name}',area=${area},code='${code}',`;
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
};
const getUnqualifiedStudents=(data)=>{
  let sql = `select organizational.id as organizational_id,organizational.name as organizational_name,organizational.province as organizational_province,organizational.city as organizational_city,organizational.area as organizational_area,student.id as student_id, student.name as student_name, student.birth as student_birth,student.class_no as student_class,student.remark as student_remark,student.address as student_address from organizational 
  left join teacher on organizational.id = teacher.organizational_id 
  left join class on teacher.id=class.teacher_id 
  left join student on class.id=student.class_id where student.id in 
  (select student.id from student left join score_record on student.id = score_record.studentId where score_record.is_up_to_standard=0 and score_record.is_deleted=${0} and student.is_deleted=${0}) and organizational.is_deleted=${0} and student.is_deleted=${0} and teacher.is_deleted=${0} and class.is_deleted=${0}
 `
  return exec(sql);
}
const getSpecialRecordStudents = ()=>{
  let sql = `select organizational.id as organizational_id,organizational.name as organizational_name,organizational.province as organizational_province,organizational.city as organizational_city,organizational.area as organizational_area,student.id as student_id, student.name as student_name  from organizational 
  left join teacher on organizational.id = teacher.organizational_id left join class on teacher.id=class.teacher_id 
  left join student on class.id=student.class_id where student.id in (select student.id from student left join score_record on student.id = score_record.studentId where score_record.special_record!="" and score_record.is_deleted=${0} and student.is_deleted=${0})  and organizational.is_deleted=${0} and student.is_deleted=${0} and teacher.is_deleted=${0} and class.is_deleted=${0} ` 
  return exec(sql);
}
const delOrganization = (id) => {
  if(typeof(id)==='undefined'){
    return new Promise(reject=>{
      reject({
        msg: '参数不全'
      })
    })
  }
  const sql = `update organizational set is_deleted=${1} where id=${id}`;

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
};
module.exports = {
  getOrganization,
  createOrganization,
  delOrganization,
  updateOrganization,
  getUnqualifiedStudents,
  getSpecialRecordStudents
};
