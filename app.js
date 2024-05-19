const express = require('express')

const mysql = require('mysql')

const path = require('path')

const fileUpload = require('express-fileupload');

const port = 8080

const app = express()

const db = mysql.createConnection({

    host: 'localhost',

    user: 'root',

    password: '',

    database: 'aladdin'

});

db.connect((error) => {

    if (error) {

        console.log(error)

    } else {

        console.log("Mysql Connected")

    }

})

app.use(express.static('public'))

app.use('/css', express.static(__dirname + 'public/css'))

app.use('/js', express.static(__dirname + 'public/js'))

app.use('/images', express.static(__dirname + 'public/images'))

app.use('/icons', express.static(__dirname + 'public/icons'))



app.use(express.urlencoded({ extended: false }))

app.use(express.json())

app.use(fileUpload());



app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');



app.use('/', require('./routes/pages'))

app.use('/auth', require('./routes/auth'))



app.listen(port, () => console.info(`Listening on Port ${port}`))