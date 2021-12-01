import * as elem from './elements.js';

// An async function to send GET request to API with name as query param
// Waits for result if response code wasn't 200 OK throw an error with error code
// Waits for body and parses it as JSON then returns it
async function submitForm(fullname) {
    if(!validateInput()) {
        throw new Error('Name should only include alphabet and space');
    }
    handleLoading();
    const result = await fetch(`https://api.genderize.io/?name=${fullname}`);
    clearNotification();
    if(result.status != 200) {
        throw new Error('Recieved response with error code:' + result.status);
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
            handleSuccess('Found a match in API database');
        } else {
            handleError('Did not find a match in API database');
        }
        elem.predictionAccuracy.innerText = resolvedResult.probability || 'Not Specified';
        fetchLocalStorage();
    } catch (error) {
        handleError(error);
    }
}

// Saves the name in input and radio option in local storage
function saveGuess() {
    if(!validateInput()) {
        handleError('Name should only include alphabet and space');
        return;
    }
    const name = elem.fullNameInput.value;
    const gender = elem.genderRadioInputs[0].checked ? 'male' : 'female';
    localStorage.setItem(name, gender);
    handleSuccess('Record saved to local storage.')
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
    handleSuccess('Record cleared from storage if existed.');
}

// Resets result in DOM to empty string
function resetResults() {
    elem.predictionGender.innerText = '';
    elem.predictionAccuracy.innerText = '';
    elem.savedGender.innerText = '';
}

// Handles and shows errors clears after 2 seconds by adding classes
function handleError(error) {
    elem.notification.innerText = error;
    elem.notification.classList.add('show');
    elem.notification.classList.add('error');
    setTimeout(clearNotification, 2000);
}

// Handles and shows success clears after 2 seconds by adding classes
function handleSuccess(msg) {
    elem.notification.innerText = msg;
    elem.notification.classList.add('show');
    elem.notification.classList.add('success');
    setTimeout(clearNotification, 2000);
}

// Handles and shows loading by adding classes
function handleLoading() {
    elem.notification.innerText = 'Fetching the data please wait...';
    elem.notification.classList.add('show');
    elem.notification.classList.add('loading');
}

// Clears the notification by changing opacity to 0
function clearNotification() {
    elem.notification.classList = 'notifications';
    elem.notification.innerText = '';
}

// Checks validation of input with regex to only contain alphabet and space
// Checks if the input is empty
// Adds red border with invalid class
function validateInput() {
    const name = elem.fullNameInput.value;
    const regex = /^[a-zA-Z ]*$/;
    if(!name.match(regex) || name.length == 0) {
        elem.fullNameInput.classList.add('invalid');
        handleError('Name should only include alphabet and space');
        return false;
    } else {
        elem.fullNameInput.classList.remove('invalid');
        return true;
    }
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

// Add eventListener on inputing of the fullname input
// Uses validation function as callback
elem.fullNameInput.addEventListener('input', validateInput);