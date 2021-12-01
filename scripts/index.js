import * as elem from './elements.js';

// An async function to send GET request to API with name as query param
// Waits for result if response code wasn't 200 OK throw an error with error code
// Waits for body and parses it as JSON then returns it
async function submitForm(fullname) {
    const result = await fetch(`https://api.genderize.io/?name=${fullname}`);
    if(result.status != 200) {
        throw new Error('Recieved response with error code:' + result.status)
    }
    return await result.json();
}

// Add eventListener on submit of the form with submit event
// Prevent default action and reload of page and use submitForm
elem.form.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
        submitForm('Jane Doe')
    } catch (error) {
        console.log(error)
    }
})
