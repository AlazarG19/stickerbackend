const express = require('express')
const app = express()
const cors = require('cors')
var fs = require('fs')
const db = require('./db')
app.use(cors())
app.use(express.json())

const BotToken    = "5099241906:AAHO300-3I0kJspMLOYaWk9ie8HZnXNkbGI";
let TelegramBot = require('node-telegram-bot-api'),telegram    = new TelegramBot(BotToken, { polling: true });
const converttoresult = (jsonobject,order_id,tg_account)=>{
    console.log(jsonobject)
    let result =
    `orders are from \n ${order_id} \n tg account @${tg_account}\n`
  for (let x in jsonobject) {
    if ('small' in jsonobject[x]) {
      result += `(   ${jsonobject[x].id}   ,"S",${jsonobject[x].small})\n`
    }
    if ('medium' in jsonobject[x]) {
        result += `(   ${jsonobject[x].id}   ,"M",${jsonobject[x].medium})\n`
    }
    if ('large' in jsonobject[x]) {
        result += `(   ${jsonobject[x].id}   ,"L",${jsonobject[x].large})\n`
    }
  }
  return result
}
const replace = (word)=>{
  let neww = ""
  for(let x in word){
    if(word[x] === "_"){
      neww+=`"`
    }else{
      neww += word[x]
    }
  }
  return neww
}
app.post('/stickers', (req, res) => {
  fs.writeFile(
    'database.txt',
    JSON.stringify(req.body.clonedProduct),
    (error) => {
      console.log(error)
    },
  )
})
app.get('/stickers', (req, res) => {
  const sqlQuery = 'select * from sticker'
  db.query(sqlQuery, (err, rows) => {
    if (err) {
      res.send(err)
    } else {
      res.send(rows)
    }
  })
})
app.get('/orders', (req, res) => {
  console.log('order get')
  fs.readFile('order.txt', 'utf-8', (err, data) => {
    const order = JSON.parse(data.toString())
    console.log('called')
    res.json(order)
  })
})
app.post('/orders', (req, res) => {
  console.log('order post called')
  // console.log(req.body)
  const sqlQuery1 = `Insert into customer values("${req.body.id}","${req.body.telegram_account}")`
  db.query(sqlQuery1, (err, rows) => {
    if (err) {
      if (err.sqlMessage.includes('Duplicate entry')) {
        const sqlQuery11 = `delete from order_item where orders_id = "${req.body.order_id}"`
        db.query(sqlQuery11, (err, rows) => {
          if (err) {
            console.log(err)
            res.send({ success: false, error: err })
          } else {
            let sqlQuery111 =
              'insert into order_item (orders_id,sticker_id,size,quantity) values '
            for (let x in req.body.cart) {
              console.log(x)
              if ('small' in req.body.cart[x]) {
                sqlQuery111 += `("${req.body.order_id}","${req.body.cart[x].id}","S",${req.body.cart[x].small}),`
              }
              if ('medium' in req.body.cart[x]) {
                sqlQuery111 += `("${req.body.order_id}","${req.body.cart[x].id}","M",${req.body.cart[x].medium}),`
              }
              if ('large' in req.body.cart[x]) {
                sqlQuery111 += `("${req.body.order_id}","${req.body.cart[x].id}","L",${req.body.cart[x].large}),`
              }
            }
            sqlQuery111 = sqlQuery111.substring(0, sqlQuery111.length - 1)
            db.query(sqlQuery111, (err, rows) => {
              if (err) {
                console.log(err)
              } else {
                let account = replace(req.body.telegram_account)
                telegram.sendMessage( 342947123,converttoresult(req.body.cart,req.body.order_id,account), {parse_mode: "Markdown"});
                res.send({ success: true, order: 'edited' })
              }
            })
          }
        })
      } else {
        res.send({ success: false, error: err })
      }
    } else {
      const sqlQuery2 = `insert into orders values("${req.body.order_id}","${req.body.id}")`
      db.query(sqlQuery2, (err, rows) => {
        if (err) {
          console.log(err)
        } else {
          let sqlQuery3 =
            'insert into order_item (orders_id,sticker_id,size,quantity) values '
          for (let x in req.body.cart) {
            console.log(x)
            if ('small' in req.body.cart[x]) {
              sqlQuery3 += `("${req.body.order_id}","${req.body.cart[x].id}","S",${req.body.cart[x].small}),`
            }
            if ('medium' in req.body.cart[x]) {
              sqlQuery3 += `("${req.body.order_id}","${req.body.cart[x].id}","M",${req.body.cart[x].medium}),`
            }
            if ('large' in req.body.cart[x]) {
              sqlQuery3 += `("${req.body.order_id}","${req.body.cart[x].id}","L",${req.body.cart[x].large}),`
            }
          }
          sqlQuery3 = sqlQuery3.substring(0, sqlQuery3.length - 1)
          db.query(sqlQuery3, (err, rows) => {
            if (err) {
              console.log(err)
            } else {
              console.log(rows)
              let account = replace(req.body.telegram_account)
              telegram.sendMessage( 342947123,converttoresult(req.body.cart,req.body.order_id,account), {parse_mode: "Markdown"});
              res.send({ success: true, order: 'new' })
            }
          })
        }
      })
    }
  })
  // console.log('orders post')
  // let id = req.body.id
  // let size = req.body.size
  // let img = id + ".png"
  // let operation = req.body.operation
  // console.log(operation)
  // var verifyOrder = (id, orderList, type, operation) => {
  //     if (operation == "add") {
  //         var i = null;
  //         for (i = 0; orderList.length > i; i += 1) {
  //             if (orderList[i].id === id) {
  //                 if (type in orderList[i]) {
  //                     if (type === "small") {
  //                         orderList[i]["small"]++
  //                         orderList[i]["total"]++
  //                     } else if (type === "medium") {
  //                         orderList[i]["medium"]++
  //                         orderList[i]["total"]++
  //                     } else if (type === "large") {
  //                         orderList[i]["large"]++
  //                         orderList[i]["total"]++
  //                     }
  //                     return orderList
  //                 } else {
  //                     if (type === "small") {
  //                         orderList[i]["small"] = 1
  //                         orderList[i]["total"]++
  //                         return orderList
  //                     } else if (type === "medium") {
  //                         orderList[i]["medium"] = 1
  //                         orderList[i]["total"]++
  //                         return orderList

  //                     } else if (type === "large") {
  //                         orderList[i]["large"] = 1
  //                         orderList[i]["total"]++
  //                         return orderList
  //                     }
  //                 }
  //             }
  //         }
  //         if (type === "small") {
  //             orderList.push({
  //                 "id": id,
  //                 "img": img,
  //                 "small": 1,
  //                 total: 1
  //             })
  //         } else if (type === "medium") {
  //             orderList.push({
  //                 "id": id,
  //                 "img": img,
  //                 "medium": 1,
  //                 total: 1
  //             })
  //         } else if (type === "large") {
  //             orderList.push({
  //                 "id": id,
  //                 "img": img,
  //                 "large": 1,
  //                 total: 1
  //             })

  //         }
  //         return orderList

  //     } else if (operation == "sub") {
  //         for (i = 0; orderList.length > i; i += 1) {
  //             if (orderList[i].id === id) {
  //                 if (type in orderList[i]) {
  //                     if (type === "small") {
  //                         orderList[i]["small"]--
  //                         orderList[i]["total"]--
  //                     } else if (type === "medium") {
  //                         orderList[i]["medium"]--
  //                         orderList[i]["total"]--
  //                     } else if (type === "large") {
  //                         orderList[i]["large"]--
  //                         orderList[i]["total"]--
  //                     }
  //                     return orderList
  //                 } else {
  //                     if (type === "small") {
  //                         orderList[i]["small"] = 1
  //                         orderList[i]["total"]++
  //                         return orderList
  //                     } else if (type === "medium") {
  //                         orderList[i]["medium"] = 1
  //                         orderList[i]["total"]++
  //                         return orderList

  //                     } else if (type === "large") {
  //                         orderList[i]["large"] = 1
  //                         orderList[i]["total"]++
  //                         return orderList
  //                     }
  //                 }
  //             }
  //         }
  //     }
  // };
  // fs.readFile('order.txt', "utf-8", (err, data) => {
  //     let order = JSON.parse(data.toString());
  //     let newOrder = verifyOrder(id, order, size, operation)
  //     // console.log(newOrder)
  //     fs.writeFile('order.txt', JSON.stringify(newOrder), (error) => {
  //         console.log(error)
  //     })
  //     res.json(newOrder)
  // })
})
app.post('/orders/delete', (req, res) => {
  console.log('orders deleted')
  let id = req.body.id
  fs.readFile('order.txt', 'utf-8', (err, data) => {
    let order = JSON.parse(data.toString())
    let newOrder = order.filter((item) => {
      return item.id != id
    })
    // console.log(newOrder)
    // var lists = list.filter(x => {
    //     return x.Id != id;
    //   })

    fs.writeFile('order.txt', JSON.stringify(newOrder), (error) => {
      console.log(error)
    })
    res.json(newOrder)
  })
})
const PORT = process.env.PORT || 5000
app.listen(PORT)
