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
                console.log("An error occured updating the todo")
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