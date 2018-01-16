function validateForm () {
    var error = '';
    var result;

    result = validation.isValidEmailAddress($('#emailAddress').val());
    error += validation.getErrorText(result);

    result = validation.isValidPassword($('#password').val());
    error += validation.getErrorText(result);
    
    result = validation.passwordsMatch($('#password').val(), $('#confirmPassword').val());
    error += validation.getErrorText(result);

    if (error.length > 0) {
        $('#localError').text(error);
        $('#localError').attr('hidden', false);
        return false;    
    }
    return true;
}