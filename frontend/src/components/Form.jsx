import React, { useState, useEffect} from 'react';
import {checkName, checkAge, checkUsername, checkGender, checkPassword} from './checkData';
import TextInputWithValidation from "../components/TextInputWithValidation";
import ReactDOM from 'react-dom';
import { Route, useHistory, useRouteMatch, useParams } from'react-router-dom';
import {userService} from '../services/userService';

export default function Form() {
    const history = useHistory();
    const FormMode = {
        NOT_FOUND: 0,
        NEW: 1,
        UPDATE: 2
    };
    const [formMode, setFormMode] = useState(FormMode.NOT_FOUND);
    let matchUrl = useRouteMatch();
    
    useEffect(() => {
        let componentIsMounted = true;
        let defaultFormUser = {
            "firstname": "",
            "lastname": "",
            "age":"",
            "username": "",
            "gender": "",
            "password": "",
            "password_confirm": ""
        };

            setFormUser(defaultFormUser);
            setFormMode(FormMode.NEW);
            
        return (() => componentIsMounted = false);
    }, [FormMode.NEW, FormMode.NOT_FOUND, FormMode.UPDATE]);


    const [formUser, setFormUser] = useState({
        "firstname": "Homer",
        "lastname": "Simson",
        "age":"54",
        "username": "homer.simpsones@springfild.us",
        "gender": "male",
        "password": "DuffBeer",
        "password_confirm": "DuffBeer"

    });

    const [formValidationInfo, setFormValidationInfo] = useState({
        "firstname":{
            valid: true,
            msg: ""
        },
        "lastname":{
            valid: true,
            msg: ""
        },
        "age":{
            valid: true,
            msg: ""
        },
        "username":{
            valid: true,
            msg: ""
        },
        "gender":{
            valid: true,
            msg: ""
        },
        "password": {
            valid: true,
            msg: ""
        },
        "password_confirm": {
            valid: true,
            msg: ""
        },
        "form":{
            valid: false,
            msg: ""
        }
    });

    const validateField = (name, value) => {
        let validationInfo;
        switch(name) {
            case "firstname":
            case "lastname":
                validationInfo = checkName(value); 
                break;
            case "age":
                validationInfo = checkAge(value); 
                break;
            case "username":
                validationInfo = checkUsername(value); 
                break;
            case "gender":
                validationInfo = checkGender(value); 
                break;
            case "password":
                validationInfo = checkPassword(value, formUser.password_confirm);
                break;
            case "password_confirm":
                validationInfo = checkPassword(formUser.password, value);
            break;
        }
        let newFormValidationInfo = {
            ...formValidationInfo,
            [name]: validationInfo
        };
        setFormValidationInfo(newFormValidationInfo);
    }

    const onChange = (event) => {
        const {name, value } = event.target;
        setFormUser({ ...formUser, [name]: value});
        validateField(name, value);
    }

    const onSubmit = (event) => {
        event.preventDefault();
        if (formValidationInfo.firstname.valid && formValidationInfo.lastname.valid && formValidationInfo.username.valid && formValidationInfo.age.valid && formValidationInfo.gender.valid && formValidationInfo.password.valid && formValidationInfo.password_confirm.valid) {
            setFormValidationInfo({ ...formValidationInfo,"form":{valid: true, msg: ""}})
                userService.create(formUser)
                    .then(() => history.push('/register'))
                    .catch((err) => alert(`ups: ${err}`));
        }
    }
   
    return (
        <form>
            <div style={{width: "80%", marginLeft: "10%", marginTop: "4%"}}>
                <div className="row">
                    <div className="col">
                    <TextInputWithValidation
                            formObject={formUser}
                            objectKey="firstname"
                            label="First name"
                            placeholder="Firstname"
                            formValidationInfo={formValidationInfo}
                            onChange={onChange}
                    ></TextInputWithValidation>
                    </div>
                    <div className="col">
                    <TextInputWithValidation
                            formObject={formUser}
                            objectKey="lastname"
                            label="Last name"
                            placeholder="Lastname"
                            formValidationInfo={formValidationInfo}
                            onChange={onChange}
                    ></TextInputWithValidation>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                    <TextInputWithValidation
                            formObject={formUser}
                            objectKey="username"
                            label="User name"
                            placeholder="Username"
                            formValidationInfo={formValidationInfo}
                            onChange={onChange}
                    ></TextInputWithValidation>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                    <TextInputWithValidation
                            formObject={formUser}
                            objectKey="age"
                            label="Age"
                            placeholder="Age"
                            formValidationInfo={formValidationInfo}
                            onChange={onChange}
                            type="number"
                    ></TextInputWithValidation>
                    </div>
                    <div className="col">
                    <TextInputWithValidation
                            formObject={formUser}
                            objectKey="gender"
                            label="Gender"
                            placeholder="Gender"
                            formValidationInfo={formValidationInfo}
                            onChange={onChange}
                    ></TextInputWithValidation>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                    <TextInputWithValidation
                            formObject={formUser}
                            objectKey="password"
                            label="Password"
                            placeholder="Password"
                            formValidationInfo={formValidationInfo}
                            onChange={onChange}
                            type="password"
                    ></TextInputWithValidation>
                    </div>
                    <div className="col">
                    <TextInputWithValidation
                            formObject={formUser}
                            objectKey="password_confirm"
                            label="Password Confirm"
                            placeholder="Password Confirm"
                            formValidationInfo={formValidationInfo}
                            onChange={onChange}
                            type="password"
                    ></TextInputWithValidation>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <button type="button" className="btn btn-primary" onClick={onSubmit}>Create</button>
                    </div>
                </div>

                {
                    /*
                    DEBUG BOX
                <div class="row">
                    <div class="col">
                        <textarea className="debug-box"readOnly value={JSON.stringify(formValidationInfo, null, ' ')}></textarea>
                    </div>
                </div>
                */
                }
            </div>  
        </form>
    );
}