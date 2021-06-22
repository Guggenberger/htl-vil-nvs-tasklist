function checkName(value) {
    let msg = "Name is okay";
    let valid = true;

    if (!value) {
        msg = "provide a name";
        valid = false;
    } else {
        if (value.length < 4) {
            msg = "name is too short";
            valid = false;
        }
        if (value.length > 30) {
            msg = "name is too long";
            valid = false;
        }
    }
    return { valid, msg }
}

function checkAge(value) {
    let msg = "Age is okay";
    let valid = true;
    if (Number.isNaN(Number.parseInt(value))) {
        msg = "age is no number";
        valid = false;
    } else {
        if (Number.parseInt(value) > 100) {
            msg = "age is to high";
            valid = false;
        }
        if (Number.parseInt(value) < 1) {
            msg = "age is to low";
            valid = false;
        }
    }

    return { valid, msg }
}

function checkUsername(value) {
    let msg = "Username is okay";
    let valid = true;

    if (!value) {
        msg = "no input";
        valid = false;
    } else {
        if (value.length < 5) {
            msg = "username is too short";
            valid = false;
        } else if (value.length > 50) {
            msg = "username is too long";
            valid = false;
        } else if (!value.includes('@')) {
            msg = "no @ included";
            valid = false;
        } else if (!value.includes('.')) {
            msg = "no . included";
            valid = false;
        }
    }

    return { valid, msg }
}

function checkGender(value) {
    let msg = "Gender is okay";
    let valid = true;

    if (!value) {
        msg = "no input";
        valid = false;
    } else {
        if (value != "male" && value != "female") {
            msg = "no gender";
            valid = false;
        }
    }

    return { valid, msg }
}

function checkPassword(pw, pw_confirm) {
    let msg = "Password is okay";
    let valid = true;

    if (!pw) {
        msg = "No password";
        valid = false;
    } else {
        if (pw.length < 6) {
            msg = "password length too small";
            valid = false;
        }
        if (pw.length > 14) {
            msg = "password length too high";
            valid = false;
        }
        if (pw != pw_confirm) {
            msg = "different passwords";
            valid = false;
        }

    }
    return { valid, msg }
}

export {checkName, checkAge, checkUsername, checkGender, checkPassword}