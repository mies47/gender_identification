//Select needed elements with css selector and export them
export const fullNameInput = document.querySelector('input#fullname_input');
export const validationError = document.querySelector('div.validate_error');
export const genderRadioInputs = document.querySelectorAll('input[name="gender"]');
export const form = document.querySelector('form.form');
export const clearBtn = document.querySelector('button.btn.clear');
export const saveBtn = document.querySelector('button.btn.save');
export const predictionGender = document.querySelector('div.prediction_result--gender');
export const predictionAccuracy = document.querySelector('div.prediction_result--accuracy');
export const savedGender = document.querySelector('div.saved_answer--gender');
export const notification = document.querySelector('div.notifications');
