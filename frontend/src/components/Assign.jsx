import React, { useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { authService } from '../services/authService.js';
import { actionService } from '../services/actionService.js';
import { useHistory } from'react-router-dom';
import {userService} from '../services/userService';
import '../style/assign.css';

export default function Assign() {
    const [users, setUsers] = useState([{ }]);
    const history = useHistory();

    const items = [
        { type: "Urlaub"},
        { type: "Zeitausgleich"},
        { type: "Fortbildung"},
        { type: "Krankenstand"},
        { type: "verfügbar"},
        { type: "nicht anwesend"},
    ]

    useEffect(() => {
        userService.getAll()
            .then(_users => { 
                setUsers(_users); 
            })
            .catch(err => {
                console.log(`Loading users failed.`, err);
            });
    });

    const clearFields = () => {
        document.getElementById("assing_userlist").value = "";
        document.getElementById("assign_datepicker").value = "";
        document.getElementById("assing_action").value = "";
        document.getElementById("assign_notes").value = "";

    }

    const submit = () => {
        var personId = document.getElementById("assing_userlist").value;
        var date = document.getElementById("assign_datepicker").value;
        var action = document.getElementById("assing_action").value;
        var notes = document.getElementById("assign_notes").value;

        if (personId !== "" && date !== "" && action !== "" && notes !== "") {
            var json = {
                "_id": "",
                "personId": `${personId}`,
                "date": `${date}`,
                "action": `${action}`,
                "notes": `${notes}`,
            }
            actionService.create(JSON.parse(JSON.stringify(json))).then(() => {
                clearFields();
                history.push("/tasklist");
                setInterval(() => {window.location.reload()}, 1000);
            }).catch((err) => {
                alert(err);
            })

        } 
    }

    return (
        <div>
            <select name="assing_userlist" id="assing_userlist">
            <option value="">Wähle eine Person</option>
            {
                users.map((item) => (
                    <option key={`userlistKey_${item._id}`} value={item._id}>{item.firstname + " " + item.lastname}</option>
                ))
            }
            </select>

            <input type="date" id="assign_datepicker"/>

            <select name="assing_action" id="assing_action">
                <option value="">Wähle eine Aktion</option>
                {
                    items.map((item) => (
                        <option key={`actionKey_${item.type}`} value={item.type}>{item.type}</option>
                    ))
                }
            </select>

            <input type="text" id="assign_notes" placeholder="Beschreibung"/>

            <button type="button" onClick={submit} id="assign_submit">Eintragen</button>
        </div>
    );
}