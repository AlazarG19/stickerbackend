const mysql = require("mysql")
const db = mysql.createConnection({
    host:"sql11.freesqldatabase.com",
    user:"sql11475243",
    password:"ZPVJ7Nf3Wd",
    database:"sql11475243",
    port: 3306
})
db.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("successfully connected to db")
    }
})
module.exports = db