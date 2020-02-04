let express = require('express')
let mongodb = require('mongodb')
let sanitizeHtml = require('sanitize-html')

let app = express()
let db

// Setup port - based on environment OR if local it is 3000
let port = process.env.PORT
if (port == null || port == "") {
    port = 3000
}

// Allow the 'public' folder access from the browser
app.use(express.static('public'))

let connectionString = 'mongodb://localhost:27017/TodoApp'
mongodb.connect(connectionString,{useNewUrlParser: true, useUnifiedTopology: true},function(err, client) {
    db = client.db()
    // Dont start listening for requests (on port 3000) until db has established its connection
    app.listen(port)
})

// Boilerplate code
// Automatically add to body object for asyncronous requests
app.use(express.json())
// Automatically take submitted form data and add to body object that lives on request object
app.use(express.urlencoded({extended: false}))

function passwordProtected(req, res, next) {
    res.set('WWW-Authenticate', 'Basic realm="Simple Todo List App"')
    console.log(req.headers.authorization)
    if (req.headers.authorization == "Basic dGVzdDp0ZXN0MTIz") {
        // Need to call "next()" to signal express to continue
        next()
    } else {
        // User Cancels Login
        res.status(401).send("Authentication required")
    }
}

// This will force the calling of passwordProtected function for ALL routes below
app.use(passwordProtected)

// passwordProtected function is called first, and then the anonymous function
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
        <h1 class="display-4 text-center py-2">To-Do List App</h1>
        
        <div class="jumbotron p-3 shadow-md">
          <form id="create-form" action="/create-todo" method="POST">
            <div class="d-flex align-items-center">
              <input id="create-field" name="todo" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add Item</button>
            </div>
          </form>
        </div>
        
        <ul id="todo-list" class="list-group pb-5">
            <!-- HTML will come from browser JS code -->
        </ul>
        
      </div>

      <script>
      let todos = ${JSON.stringify(todos)}
      </script>

      <!-- Using Axios for communicating from browser to node.js (I think you can install node package instead) -->
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <script src="/browser.js"></script>
    </body>
    </html>
    `)
    })
    
})

app.post('/create-todo', function(req, res) {
    // Do not allow any todo text with HTML tags or attributes
    let safeText = sanitizeHtml(req.body.text, {allowedTags: [], allowedAttributes: {}})

    db.collection('todos').insertOne({text: safeText}, function(err, info) {
        // "info.ops[0]" is array associated with newly inserted data
        res.json(info.ops[0])
    })
})

app.post('/update-todo', function(req, res) {
    // Do not allow any todo text with HTML tags or attributes
    let safeText = sanitizeHtml(req.body.text, {allowedTags: [], allowedAttributes: {}})
    // Cannot just use req.body.id - must use a special mongodb object id
    db.collection('todos').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set: {text: safeText}}, function() {
        res.send("Success!")
    })
})

app.post('/delete-todo', function(req, res) {
    // Cannot just use req.body.id - must use a special mongodb object id
    db.collection('todos').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, function() {
        res.send("Success!")
    })
})