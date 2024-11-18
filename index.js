const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
//Connect to mongoDB 
const db = require('./config/db');
db.connect();

//Tạo biến đại diện
const Product = require('./models/Product');
//Parsing data received from the client
const bodyParser = require('body-parser');
app.use(bodyParser.json());




app.use(cors())

// API
app.get("/", (req, res)=>{
    res.send("Ok")
})
//tương ứng luồng get lên
app.get("/products", (req, res) => {
    // res.send(
    //     [
    //         {code: 1, name: "Tiger", price: 18000},
    //         {code: 2, name: "Heineken", price: 19000},
    //         {code: 3, name: "Sapporo", price: 25000},
    //         {code: 4, name: "Blanc 1664", price: 22000},
    //     ]
    // )

    //Read data from db
    // Product.find({}, function(err, products){
    //     if (err) {
    //         res.status(500).json({Error: "ERROR"})
    //     }
    //     else{
    //         res.json(products)
    //     }
    // })


    //Phương pháp Promise
    // Product.find({price: {$gte: 20000}}) -- thiết lập điều kiện truy vấn
    Product.find({})
        .then(products => res.json(products))
        .catch(err => res.status(500).json({error: err.message}))
})

//insert...post
app.post("/product", async(req, res) => {
    // console.log(req.body);
    const product = new Product({
        name: req.body.name,
        price: req.body.price
    });
    try{
        const saveProduct = await product.save();
        console.log(saveProduct);
        res.send("Success");
    } 
    catch (err){
        res.json({Error: err,message})
    }
});

//Update Product
app.patch("/:id", async(req, res) => {
    // console.log("Id: ", req.params.id)
    if(req.params.id){
        try{
            await Product.updateOne({_id: req.params.id}, {
                $set: {price: req.body.price}})
                res.json({status: 'Success'});
            } catch(error){
                res.json({Error: error.message})
            }
        }
})
//Delete data
app.delete("/:id", async(req, res) => {
    if(req.params.id){
        try{
            await Product.deleteOne({_id: req.params.id})
                res.send("Success");

        }catch (error){
            res.json({Error: error.message})
        }
    }
})

app.listen(port, ()=>{
    console.log(`Server listening on port: ${port}`)
})