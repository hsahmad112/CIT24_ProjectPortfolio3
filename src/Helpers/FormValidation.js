
//match at least one digit, special character and upper cased character, minimum length of 8 characters
// inspiration from: https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a   

const passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-[\]{};':"\\|,.<>\/?]).{8,}$/ 
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 


export const validatePassword = (password, setErrorMessage, setIsFieldValid) => {
    const errorKey = "invalidPasswordFormat";
    const invalidPasswordFormatMessage = "Wrong format: Match at least one digit, special character, uppercase letter, and 8+ characters." 
    if(!password) return;
    if(!doesFieldPassRegex(password, passwordRegex, setIsFieldValid, setErrorMessage, errorKey, invalidPasswordFormatMessage)){
        return;
    }
    else {
        clearErrorMessage(setIsFieldValid, setErrorMessage, errorKey);
    }
};

export const comparePasswords = (password, confirmPassword, setErrorMessage, setIsFieldValid) => {
    const errorKey = "passwordMismatch";
    const passwordMismatchMessage = "Password fields do not match.";
    if(!password || !confirmPassword) return;
  
    if(password !== confirmPassword){
        setError(setIsFieldValid, setErrorMessage, errorKey, passwordMismatchMessage);
    }
    else{
        clearErrorMessage(setIsFieldValid, setErrorMessage, errorKey);      
    }
}

export const validateEmail = (email, setErrorMessage, setIsFieldValid) => {
    const errorKey = "invalidEmailFormat";
    const invalidEmailFormatMessage = "The format of the email is not correct. Please insert a valid email address" 
    if(isFieldEmpty(email, setIsFieldValid, setErrorMessage, errorKey)){
        return;
    }
    if(!doesFieldPassRegex(email, emailRegex, setIsFieldValid, setErrorMessage, errorKey, invalidEmailFormatMessage)){
        return;
    }
    else{
        clearErrorMessage(setIsFieldValid, setErrorMessage, errorKey);
    }
}

export const validateName = (firstname, setErrorMessage, setIsFieldValid) => {
    const errorKey = "invalidFirstNameFormat";
    const invalidFirstNameFormatMessage = "The minimum required length for a name is 2 characters. Idk why tho.."

    if(isFieldEmpty(firstname, setIsFieldValid, setErrorMessage, errorKey)){
        return;
    }
    if(firstname === "" || firstname.length < 2){
        setError(setIsFieldValid, setErrorMessage, errorKey, invalidFirstNameFormatMessage)
    }
    else{
        clearErrorMessage(setIsFieldValid, setErrorMessage, errorKey);
    }
}


//Meta helpers (Helper functions for the helpers)
function isFieldEmpty(field, setIsFieldValid, setErrorMessage, errorKey){
    if(field === ""){
        setIsFieldValid(true); //should not be able to pass empty fields
        setErrorMessage((prevState) => ({
            ...prevState,
            [errorKey]: ""
        }));
        return true; //field empty, remove error message
    }
    return false; //field not empty, returns false
}



function doesFieldPassRegex(field, regex, setIsFieldValid, setErrorMessage, errorKey, errorMessage){
    if(!regex.test(field)){
        setIsFieldValid(true);
        setErrorMessage((prevState) => ({
            ...prevState,
            [errorKey]: errorMessage
        }));
        return false;
    }
    return true;
}

function setError(setIsFieldValid, setErrorMessage, errorKey, errorMessage){
    setIsFieldValid(true);
    setErrorMessage((prevState) => ({
        ...prevState,
        [errorKey]: errorMessage
    }));
    return true; //field empty, remove error message
}

function clearErrorMessage(setIsFieldValid, setErrorMessage, errorKey){
    setIsFieldValid(false);
    setErrorMessage((prevState) => ({
        ...prevState,
        [errorKey]: ""
    }));
}
