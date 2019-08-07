const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
    data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
    data.username = !isEmpty(data.username) ? data.username : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    if (validator.isEmpty(data.firstName)) {
        errors.firstName = "Must enter a first name";
    }

    if (validator.isEmpty(data.lastName)) {
        errors.lastName = "Must enter a last name";
    }

    if (validator.isEmpty(data.username)) {
        errors.username = "Must enter a username";
    }

    if (validator.isEmpty(data.email)) {
        errors.email = "Must enter an email";
    } else if (!validator.isEmail(data.email)) {
        errors.email = "Must enter a valid email";
    }

    if (validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    } else if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
    }

    if (validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
    } else if (!validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};