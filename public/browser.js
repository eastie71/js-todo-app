function todoTemplate(todo) {
    return `
    <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">${todo.text}</span>
        <div>
          <button data-id="${todo._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
          <button data-id="${todo._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
        </div>
    </li>`
}

function setupTodoList(todo_list, list_name) {
    // Setup the ToDo List Page Heading
    document.getElementById("todo-header").innerHTML = list_name + " To-Do List"
    // Setup the List of Todos
    document.getElementById("todo-list").innerHTML = ""
    let listHTML = todo_list.map(function(todo) {
        return todoTemplate(todo)
    }).join('')
    document.getElementById("todo-list").insertAdjacentHTML("beforeend", listHTML)
}

// Initial Page Loader for Todo List
setupTodoList(todos, db_name)

// Switch Database feature
document.getElementById("switch-db-form").addEventListener("submit", function(e) {
    e.preventDefault()
    // Send request to switch database asyncronously to server to switch the db used
    // Using axios JS library to perform this operation
    axios.post('/switch-db').then(function(response) {
        // after switch db has completed, then need to redisplay the header and the list of todos
        console.log("Switched DB OK")
        console.log(response.data)
        setupTodoList(response.data[0], response.data[1])
    }).catch(function() {
        console.log("An error occured switching the database")
    })
})

// Create Feature
let createField = document.getElementById("create-field")

document.getElementById("create-form").addEventListener("submit", function(e) {
    e.preventDefault()
    // Send request to create todo asyncronously to server to create todo in the db
    // Using axios JS library to perform this operation
    axios.post('/create-todo', {text: createField.value}).then(function(response) {
        // after create has completed, then create the HTML required to display new todo
        document.getElementById("todo-list").insertAdjacentHTML("beforeend", todoTemplate(response.data))
        // Clear the new todo field, and re-focus on that field ready for next entry
        createField.value = ''
        createField.focus()
    }).catch(function() {
        console.log("An error occured creating the todo")
    })
})

document.addEventListener("click", function(e) {
    if (e.target.classList.contains("delete-me")) {
        // Delete Feature
        if (confirm("Please confirm you wish to delete this todo item permanently")) {
            // Send request to delete todo asyncronously to server to remove from the db
            // Using axios JS library to perform this operation
            axios.post('/delete-todo', {id: e.target.getAttribute("data-id")}).then(function(){
                // after delete has completed, then remove list item html
                e.target.parentElement.parentElement.remove()
            }).catch(function() {
                console.log("An error occured deleting the todo")
            })
        }
    } else if (e.target.classList.contains("edit-me")) {
        // Update Feature
        let userInput = prompt("Enter your New Todo", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
        if (userInput) {
            // Send updated todo text asyncronously to server to update to db
            // Using axios JS library to perform this operation
            axios.post('/update-todo', {text: userInput, id: e.target.getAttribute("data-id")}).then(function(){
                // after update has completed, then set the HTML to the new user input data
                e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
            }).catch(function() {
                console.log("An error occured updating the todo")
            })
        }
    }
})