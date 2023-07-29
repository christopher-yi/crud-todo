// npm install nodemon --save-dev
// npm install nodemon --save-dev

// Declare variables
const express = require('express')
const app = express()
const PORT = 8500
const mongoose = require('mongoose')
require('dotenv').config()
const TodoTask = require('./models/todotask')

// Set middleware
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

mongoose.connect(process.env.DB_STRING, 
    { useNewUrlParser: true }, 
    () => {console.log("Connected to db!");}
)

app.get('/', async (req, res) => {
    try {
        TodoTask.find({}, (err, tasks) => {
            res.render('index.ejs', {todoTasks: tasks})
        })
    } catch (err) {
        if (err) return res.status(500).send(err)
    }
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))