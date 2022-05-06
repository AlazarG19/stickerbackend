const mysql = require("mysql")
const db = mysql.createConnection({
    host:"sql11.freemysqlhosting.net",
    user:"sql11490422",
    password:"ydPrVqNHDf",
    database:"sql11490422",
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