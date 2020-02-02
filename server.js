let express = require('express')
let mongodb = require('mongodb')

let app = express()
let db

let connectionString = 'mongodb://localhost:27017/TodoApp'
mongodb.connect(connectionString,{useNewUrlParser: true, useUnifiedTopology: true},function(err, client) {
    db = client.db()
    // Dont start listening for requests (on port 3000) until db has established its connection
    app.listen(3000)
})

// Boilerplate code
app.use(express.urlencoded({extended: false}))

app.get('/', function(req, res) {
    db.collection('todos').find().toArray(function(err, todos) {
        res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-2">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-md">
          <form action="/create-todo" method="POST">
            <div class="d-flex align-items-center">
              <input name="todo" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add Item</button>
            </div>
          </form>
        </div>
        
        <ul class="list-group pb-5">
          ${todos.map(function(todo) {
            return `
        <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
            <span class="item-text">${todo.text}</span>
            <div>
              <button class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
              <button class="delete-me btn btn-danger btn-sm">Delete</button>
            </div>
        </li>`
          }).join('')}
        </ul>
        
      </div>
      
    </body>
    </html>
    `)
    })
    
})

app.post('/create-todo', function(req, res) {
    db.collection('todos').insertOne({text: req.body.todo}, function() {
        res.redirect('/')
    })
})
