import React, { useState, useEffect} from 'react';
import { authService } from '../services/authService.js';
import { actionService } from '../services/actionService.js';
import { useHistory } from'react-router-dom';
import { userService } from '../services/userService';
import '../style/tasklist.css';
import { render } from 'react-dom';

export default function Tasklist() {
    const [users, setUsers] = useState([{ }]);
    const history = useHistory();

    useEffect(() => {
        userService.getAll()
            .then(users => { 
                setUsers(users); 
            })
            .catch(err => {
                console.log(`Loading users failed.`, err);
            });
        setDate();
    });

    var date = new Date();
    var date2 = new Date();
        date2.setDate(date.getDate() + 1);
    var date3 = new Date();
        date3.setDate(date2.getDate() + 1);
    var date4 = new Date();
        date4.setDate(date3.getDate() + 1);
    var date5 = new Date();
        date5.setDate(date4.getDate() + 1);
    var date6 = new Date();
        date6.setDate(date5.getDate() + 1);
    var date7 = new Date();
        date7.setDate(date6.getDate() + 1);    

    //day 0 bis 6
    const getAction = (user, day, id) => {
        if (typeof user._id !== "undefined") {
            var date = new Date();
                date.setDate(date.getDate() + day);
            var string = { personId: `${user._id}`, date: `${date}`}
            actionService.getActionByDateAndId(string).then((item) => {
                const items = [
                    { type: "Urlaub"},
                    { type: "Zeitausgleich"},
                    { type: "Fortbildung"},
                    { type: "Krankenstand"},
                    { type: "verfügbar"},
                    { type: "nicht anwesend"},
                ]
                var string;
                switch (item.action) {
                    case "Urlaub": string = "UL"; break;
                    case "Zeitausgleich": string = "ZA"; break;
                    case "Fortbildung": string = "FB"; break;
                    case "Krankenstand": string = "KS"; break;
                    case "verfügbar": string = "OK"; break;
                    case "nicht anwesend": string = "NA"; break;                               
                    default: string = "empty"; break;
                }
                document.getElementById(id).innerHTML = string;
            }).catch((err) => {
                alert(err);
            });
        }
    }

    const setDate = () => {
       users.forEach(item => {
            getAction(item, 0, "table_td_text1");
            getAction(item, 1, "table_td_text2");
            getAction(item, 2, "table_td_text3");
            getAction(item, 3, "table_td_text4");
            getAction(item, 4, "table_td_text5");
            getAction(item, 5, "table_td_text6");
            getAction(item, 6, "table_td_text7");
            
        });
    }

    const back = () => {

    }

    const next = () => {

    }

    return (
        <div id="tasklist_background">
             <table id="tasklist_table">
                <thead>
                    <tr>
                        <th id="table_th_name"><p id="table_th_back" onClick={back}>BACK</p><p id="table_th_next" onClick={next}>NEXT</p></th>
                        <th id="table_th">{date.getDate() + "." + date.getMonth() + "." + date.getFullYear()}</th>
                        <th id="table_th">{date2.getDate() + "." + date2.getMonth() + "." + date2.getFullYear()}</th>
                        <th id="table_th">{date3.getDate() + "." + date3.getMonth() + "." + date3.getFullYear()}</th>
                        <th id="table_th">{date4.getDate() + "." + date4.getMonth() + "." + date4.getFullYear()}</th>
                        <th id="table_th">{date5.getDate() + "." + date5.getMonth() + "." + date5.getFullYear()}</th>
                        <th id="table_th">{date6.getDate() + "." + date6.getMonth() + "." + date6.getFullYear()}</th>
                        <th id="table_th">{date7.getDate() + "." + date7.getMonth() + "." + date7.getFullYear()}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((item) => (
                            <tr key={`tr_${item._id}`}>
                                <td id="table_td_name"><p>{item.firstname + " " + item.lastname}</p></td>
                                <td id="table_td"><p id="table_td_text1"></p></td>
                                <td id="table_td"><p id="table_td_text2"></p></td>
                                <td id="table_td"><p id="table_td_text3"></p></td>
                                <td id="table_td"><p id="table_td_text4"></p></td>
                                <td id="table_td"><p id="table_td_text5"></p></td>
                                <td id="table_td"><p id="table_td_text6"></p></td>
                                <td id="table_td"><p id="table_td_text7"></p></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}