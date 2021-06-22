import React, { useEffect }    from 'react';
import { useHistory } from 'react-router';
import avatar   from '../images/avatar.png';
import { authService } from '../services/authService.js';
import '../style/login.css';

export default function Login() {
    const history = useHistory();
    window.sessionStorage.clear();

    const adminUser = {
        username: "Admin@chat.app",
        password: "admin",
    }

    useEffect(()=>{
        document.getElementById("login_username").value = "Debbie@chat.app";
        document.getElementById("login_password").value = "12345";
    },[])

    const submit_click = () => {
        var username = document.getElementById("login_username").value;
        var password = document.getElementById("login_password").value;

        if (adminUser.username === username && adminUser.password === password) {
            window.sessionStorage.setItem("adminMode", "admin");
        }
       
        authService.login({"username": username, "password": password})
            .then(() => {
                clearFields();
                history.push("/tasklist");
                window.location.reload();
            })
            .catch((err) => {
                alert(err);
            })
    }

    const clearFields = () => {
        document.getElementById('login_username').value = "";
        document.getElementById('login_password').value = "";
    }

    return (
        <div>
            <form>
                <div className="imgcontainer">
                    <img src={avatar} alt="Avatar" className="avatar" id="avatar_image"></img>
                </div>

                <div className="container">
                    <label htmlFor="uname"><b>Username</b></label>
                    <input type="text" placeholder="Enter Username" name="uname" id="login_username" required></input>

                    <label htmlFor="psw"><b>Password</b></label>
                    <input type="password" placeholder="Enter Password" name="psw" id="login_password" required></input>
                        
                    <button type="button" onClick={submit_click}>Login</button>
                </div>
            </form>
        </div>
    );
}