var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var passwordRegex = /^.{6,}$/;

var validation = {};

validation.getErrorText = function (result) {
    if (result == true) {
        return '';
    }
    return result + '\n';
}

validation.isValidEmailAddress = function (emailAddress) {
    if (!emailRegex.test(emailAddress)) {
        return 'Please enter a valid email address.';
    }
    return true;
}

validation.isValidPassword = function (password) {
    if (!passwordRegex.test(password)) {
        return 'Your password must be at least 6 characters long.';
    }
    return true;
}

validation.passwordsMatch = function (password1, password2) {
    if (password1 != password2) {
        return 'Your passwords do not match.';
    }
    return true;
}