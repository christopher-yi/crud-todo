// npm install nodemon --save-dev
// npm install nodemon --save-dev

// Declare variables
const express = require('express')
const app = express()
const PORT = 8500
const mongoose = require('mongoose')
require('dotenv').config()
const TodoTask = require('./models/todotask')
const { reset } = require('nodemon')

// Set middleware
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

mongoose.connect(process.env.DB_STRING, 
    { useNewUrlParser: true }, 
    () => {console.log("Connected to db!");}
)

// Get Method
app.get('/', async (req, res) => {
    try {
        TodoTask.find({}, (err, tasks) => {
            res.render('index.ejs', {
                todoTasks: tasks
            })
            console.log(tasks)
        })
    } catch (err) {
        if (err) return res.status(500).send(err)
    }
})

// Post Method
app.post('/', async (req, res) => {
    const todoTask = new TodoTask(
        {
            title: req.body.title,
            content: req.body.content
        }
    )
    try {
        await todoTask.save()
        console.log(todoTask)
        res.redirect('/')
    } catch(err) {
        if(err) return res.status(500).send(err)
        res.redirect('/')
    }
})

// Update Method
app
    .route('/edit/:id')
    .get((req, res) => {
        const id = req.params.id
        TodoTask.find({}, (err, tasks) => {
            res.render('edit.ejs', {
                todoTasks: tasks, idTask: id 
            })
        })
    })
    .post((req,res) => {
        const id = req.params.id
        TodoTask.findByIdAndUpdate(
            id,
            {
                title: req.body.title,
                content: req.body.content
            },
            err => {
                if (err) return res.status(500).send(err)
                res.redirect('/')

            }
        )
    })

// Delete Method
app
    .route('/remove/:id')
    .get((req, res) => {
        const id = req.params.id
        TodoTask.findByIdAndRemove(id, err => {
            if (err) return res.status(500).send(err)
            res.redirect('/')
        })
    })

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))