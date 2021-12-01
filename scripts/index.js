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

// An async function to show recieved result from API in DOM
// Also catches error and pass it to error handler
async function showPredictionResult(result) {
    try {
        resetResults();
        const resolvedResult = await result;
        elem.predictionGender.innerText = resolvedResult.gender || 'Not Specified';
        if(resolvedResult.gender){
            elem.genderRadioInputs[0].checked = resolvedResult.gender == 'male';
            elem.genderRadioInputs[1].checked = !elem.genderRadioInputs[0].checked;
        }
        elem.predictionAccuracy.innerText = resolvedResult.probability || 'Not Specified';
        fetchLocalStorage();
    } catch (error) {
        handleError(error);
    }
}

// Saves the name in input and radio option in local storage
function saveGuess() {
    const name = elem.fullNameInput.value;
    const gender = elem.genderRadioInputs[0].checked ? 'male' : 'female';
    localStorage.setItem(name, gender);
}

// Fetches data from local storage based on input and changes the value of saved answer
function fetchLocalStorage() {
    const name = elem.fullNameInput.value;
    const gender = localStorage.getItem(name) || 'Nothing in storage';
    elem.savedGender.innerText = gender;
}

// Tries to remove the item from local storage based in input value
function clearLocalStorage() {
    const name = elem.fullNameInput.value;
    localStorage.removeItem(name);
}

// Resets result in DOM to empty string
function resetResults() {
    elem.predictionGender.innerText = '';
    elem.predictionAccuracy.innerText = '';
    elem.savedGender.innerText = '';
}

// Handles and shows errors
function handleError(error) {

}

// Add eventListener on submit of the form with submit event
// Prevent default action and reload of page and use submitForm
elem.form.addEventListener('submit', (e) => {
    e.preventDefault();
    showPredictionResult(submitForm(elem.fullNameInput.value));
});

// Add eventListener on click of the save button
// Prevent default action
elem.saveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    saveGuess();
});

// Add eventListener on click of the clear button
// Prevent default action
elem.clearBtn.addEventListener('click', (e) => {
    e.preventDefault();
    clearLocalStorage();
});