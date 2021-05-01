const express= require('express')
const app= express()

app.set('view engine','ejs')
app.use(express.static ('public'))




const Mongo = require("mongodb");
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
const url = 'mongodb://127.0.0.1:27017';
const dbname='cheppulu';
let db;
Mongo.MongoClient.connect(url,function(err,cursor){
    db = cursor.db(dbname);
    console.log(`db:${url}`);
    console.log(`database:${dbname}`);

});
app.get('/create',(req,res)=>{
    res.render('add.ejs')
})
app.get('/update',(req,res)=>{
    res.render('update.ejs');
})
app.get('/delete',(req,res)=>{
    res.render('delete.ejs');
})
app.get('/',(req,res)=>{
    db.collection('footwear').find().toArray((err,result)=>{
        if(err)
        return err
        res.render('index.ejs',{data:result})


    })


})

app.post('/add',(req,res)=>{
    
    db.collection('footwear').save(req.body,(err,result)=>{
        if(err)
        return console.log(err)
         res.redirect('/')
    })
})
var s;
 app.post('/update',(req,res)=>{
     db.collection('footwear').find().toArray((err,result)=>{
         if(err)
         return console.log(err);
         for(var i=0;i<result.length;i++){
             if(result[i].pid==req.body.pid)
             {
                 s=result[i].stock
                 break;
             }
            }
 
        db.collection('footwear').findOneAndUpdate({pid:req.body.pid},{
        
        
             $set :{stock: s+ req.body.stock}},(err,result)=>{
                 if (err)
                 res.send(err)
                console.log(req.body.id+'stock updated')
                res.redirect('/')
             })
         })
 })
app.post('/delete',(req,res)=>{
    db.collection('footwear').deleteOne({pid:req.body.pid},(err,result)=>{
        if(err)
            return console.log('no')
        res.redirect ('/');
    })

}) 

app.listen(5000);
console.log('running on 3000......');