const express = require('express')
const hbs = require('hbs')

var app = express();
app.set('view engine', 'hbs')

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://tommy:123456abc@cluster0.lkrga.mongodb.net/test";
//mongodb+srv://TuanDuyNGU:150623@cluster0.13z7h.mongodb.net/DuyNguyenDB
//mongodb+srv://tommy:123456abc@cluster0.lkrga.mongodb.net/test

var img = require('path').join(__dirname, '/img');
app.use(express.static(img));
app.get('/', (req, res) => {
    res.render('index');//dg dan trang index
})

app.get('/login', (req, res) => {
    res.render('login')//dg dan trang login
})
app.post('/dologin', async (req, res) => {
    const nameInput = req.body.txtName;
    const passInput = req.body.txtPass;

    const client = await MongoClient.connect(url);
    const dbo = client.db(dbName);
    const user = await dbo.collection("users").
        findOne({ $and: [{ name: nameInput }, { password: passInput }] });
    var messageStatus;
    console.log(user);
    if (user != null) {
        messageStatus = 'login oke!';
    } else {
        messageStatus = 'login Failed!';
    }
    res.render('index', {msg: messageStatus })
});
const dbName = "DoQuocBinhDB";
app.post('/register', async (req, res) => {
    const nameInput = req.body.txtName;
    const passInput = req.body.txtPass;
    const newUser = { name: nameInput, password: passInput };

    const client = await MongoClient.connect(url);
    const dbo = client.db(dbName);
    await dbo.collection("users").insertOne(newUser);
    res.redirect('/')
})

var PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log('Sever is running at:' + PORT);