
const { exec } = require("../db/mysql");


const login = (data)=>{
     const {
        userName,
        userType='student',
        password

     }=data;

     const sql = `select user.company_id as studentId,user.user_name as userName,user.admin_code as adminCode,user.phone as phone,user.sex as sex,user.user_type as userType,user.head_logo as headLogo from user where user_name='${userName}' and password='${password}' and user_type='${userType}'`;

     return exec(sql)
}

module.exports = {
    login
}