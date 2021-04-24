const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

var db;

MongoClient.connect('mongodb://localhost:27017/Library',{ useUnifiedTopology: true }, (err, database) => {
    if(err) return console.log(err);
    db = database.db('Library');
    app.listen(3000, () => {
        console.log("Listening on port 3000...")
    })
})

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    db.collection('Books').find().toArray((err, result) => {
        if(err) throw err;
        res.render('homepage.ejs', {data: result, success: 'hi'});
    })
});

app.get('/addBooks', (req, res) => {
    res.render('addBooks.ejs');
});

app.get('/updateBooks', (req, res) => {
    res.render('updateBooks.ejs');
});

app.get('/deleteBooks', (req, res) => {
    res.render('deleteBooks.ejs');
});

app.post('/addBooks', (req, res) => {
    db.collection('Books').insertOne(req.body, (err, result) => {
        if(err) throw err;
    });
    res.redirect('/');
});

app.post('/updateBooks', (req, res) => {
    console.log(req.body);
    db.collection('Books').updateOne(
        {"ID": req.body.ID}, {$set: {"Copies": req.body.copies}}, (err) => {
        if(err) throw err;  
    });
    res.redirect('/');
})

app.post('/deleteBooks', (req, res) => {
    db.collection('Books').deleteOne({"ID":req.body.ID}, (err) => {
        if(err) throw err;
        res.redirect('/');
    })
})