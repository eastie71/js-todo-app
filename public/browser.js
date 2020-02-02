document.addEventListener("click", function(e) {
    if (e.target.classList.contains("edit-me")) {
        let userInput = prompt("Enter your New Todo", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
        if (userInput) {
            // Send updated todo text asyncronously to server to update to db
            // Using axios JS library to perform this operation
            axios.post('/update-todo', {text: userInput, id: e.target.getAttribute("data-id")}).then(function(){
                // after update has completed
                e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
            }).catch(function() {
                console.log("An error occured updating the todo")
            })
        }
    }
})