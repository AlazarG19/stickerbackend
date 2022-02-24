const mysql = require("mysql")
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"123456789",
    database:"stickerwebsite"
})
db.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("successfully connected to db")
    }
})
module.exports = db