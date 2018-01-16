
module.exports.isValidEmailAddress = function (emailAddress) {
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return emailRegex.test(emailAddress);
}

module.exports.isValidPassword = function (password) {
    var passwordRegex = /^.{6,}$/;

    return passwordRegex.test(password);
}