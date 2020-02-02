document.addEventListener("click", function(e) {
    if (e.target.classList.contains("edit-me")) {
        let userInput = prompt("Enter your New Todo")
        // Send updated todo text asyncronously to server to update to db
        // Using axios JS library to perform this operation
        axios.post('/update-todo', {text: userInput}).then(function(){
            // coming soon
        }).catch(function() {
            console.log("An error occured updating the todo")
        })
    }
})