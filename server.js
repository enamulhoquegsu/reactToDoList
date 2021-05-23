
import express from 'express'
import mongoose from 'mongoose';
import var_ from 'lodash'
//require('dotenv').config()
import {} from 'dotenv/config'
const app = express()
const PORT = process.env.PORT || 8080
let defaultArray = [{item_name: 'Welcome to your do list'}, 
  { item_name: 'Hit the Plus button to enter a new item'}, 
  { item_name : 'Click on delete icon to delete item'
}]
app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())


app.get('/api/items/', (req, res)=>{
    Item.find((err, items)=>{
      if(!err){
        res.send(items)
      }
      else{
        res.send("something went wrong")
      }
    })
})

app.post('/api/items/', (req, res)=>{
  const item = req.body.item

  const createItem = new Item({
    item_name : item 
  })

  createItem.save((err, data)=>{
    if(!err){
       res.send({data: "data is saved"})
    }else{
      res.send({error:"something went wrong, try again."})
    }
  })
})


app.post('/api/item/update/', (req, res)=>{
  const item_id = req.body.item_id
  const item_name = req.body.item_name
  console.log("id is " + item_id)
  console.log("item_name" + item_name);
  Item.findByIdAndUpdate(item_id, { item_name: item_name },
    function (err, docs) {
    if (err){
      console.log(err)
      res.send(err)
    }
    else{
      console.log("Updated User : ", docs);
      res.send(docs)
    }
  })

})







/********************************************************************* */

app.post('/api/item/delete/', (req, res)=>{
  const item_id = req.body.item_id
  const categoryName = req.body.categoryName

  console.log( " item id " + item_id)

  console.log("delete item " + categoryName)
  
  if(item_id && categoryName){
    List.findOneAndUpdate({category_name: categoryName}, 
      { $pull : { items : { _id : item_id } } }, (error, itemDeleted)=>{
        if(!error){
          console.log( " item is deleted "  + itemDeleted)
          //res.send({success: "category item is deleted"})
          res.send(itemDeleted)
          
        }else{
          res.send({error : "something went wrong"})
        }

    })
  
  } else{
    Item.deleteOne({_id : item_id}, function(err,doc){
      if(!err){
       // res.send({success: "item is deleted"})
       res.send(doc)
      }else{
        res.send({error : "something went wrong"})
      }
    })
  }


})

// send only List of Categories name 
app.get('/api/categories/', (req, res)=>{
  List.find((err, categorylist)=>{
    if(!err){
      const lists = categorylist.map(x=>{
        return x.category_name
      })
      res.send(lists)
      
    }
    
  })
  
})
// this url is good..........................
app.get('/api/categories/:categoryName', (req, res)=>{
  const categoryName = req.params.categoryName
  
  List.findOne({ category_name: categoryName }, function (err, found) {
    if(!err){
      if(found===null){
        const listItem = new List({
          category_name : categoryName,
          items : defaultArray
        })
        listItem.save((err, data)=>{
          if(!err){
            res.send({data: data})
          }else{
            res.send({error:"something went wrong, try again."})
          }
        })
      }else if(found){
       
        res.send({categoryExist : found})
      
      }
    }else{
      res.send("somthing went wrong")
    }
  })
  
})

app.post("/api/createCategory/", (req, res)=>{
  const categoryName = req.body.category
  List.findOne({ category_name: categoryName }, function (err, found) {
    if(!err){
      if(found===null){
        const listItem = new List({
          category_name : categoryName,
          items : defaultArray
        })
        listItem.save((error, data)=>{
          if(!error){
            res.send({saveList: data})
          }else{
            res.send({error:error.message})
          }
        })
      }else if(found){
        res.send({categoryExist : found})
      }
    }else{
      res.send({error : "some went wrong"})
    }

  });
  
})

// add item in the category [ here category is already existed]
app.post('/api/category/addItem/',(req, res)=>{
  const categoryName = req.body.categoryName
  const item = req.body.item
  console.log(categoryName)
  console.log(item)
  const addItem = new Item({
    item_name : item
  })

  if(!item || !categoryName){
    res.send("Empty field is not allowed")
  }else{
    List.findOne({ category_name: categoryName }, function (err, found) {
    if(!err){
      if(found===null){
        const listItem = new List({
          category_name : categoryName,
          items : defaultArray
        })
        listItem.save((err, data)=>{
          if(!err){
            res.send({data: data})
          }else{
            res.send({error:"something went wrong, try again."})
          }
        })
      }else if(found){
       found.items.push(addItem)
       console.log('here')
       console.log(found.items)
        found.save((err, data)=>{
          if(!err){
            res.send(data)
          }
          else{
            res.send(err.message)
          }
          
        })
        
      }
    }else{
      res.send("somthing went wrong")
    }
  })
  }

})

/********************************************** */

app.post('/api/category/update/',(req, res)=>{
  const item_id = req.body.item_id
  const categoryName = req.body.categoryName
  const item_name = req.body.item_name

  List.findOne({category_name: categoryName}).then(doc => {
    
    console.log(doc.items)
    const item = doc.items.id(item_id );

    //item["item_name"] = "dhakaaaaa"

    item.item_name = item_name
  
    doc.save().then(response=>{
      res.send("success")
    }).catch(error=>{
      res.send(error.message)
    })
    
    

    //sent respnse to client
  }).catch(err => {
    console.log('Oh! Dark')
  });
        
      

})


if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'))
}

/***************************Mongo Db connection  ******************************************* */
mongoose.connect("mongodb+srv://"+ process.env.MONGOPASSWORD +"/myapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true

}).then(()=> console.log('connect'))
.catch((error) => console.error(error));
/****************************************************************** */



const itemSchema = new mongoose.Schema({
    item_name : {
        type: String,
        required: true
    }
})

const Item = mongoose.model('Item', itemSchema);

/** *********************************  */  

const listCategorySchema = new mongoose.Schema({
    category_name : {
        type: String,
        required: true
    },
    items : [itemSchema]
})

const List = mongoose.model('List', listCategorySchema);






/****************************************************************** */
app.listen(PORT, ()=>{
    console.log("todolist server is working on port: " + PORT);
})