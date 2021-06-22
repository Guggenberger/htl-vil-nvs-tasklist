import React, { useEffect }    from 'react';
import { useHistory } from 'react-router';
import '../style/tasklist.css';

export default function Tasklist() {
    const history = useHistory();

    var tasks = [
        {name: "Mathias Guggenberger", activity: { montag: "FB", dienstag: "FB", mittwoch: "FB", donnerstag: "FB", freitag: "FB", samstag: "FB", sonntag: "FB", }},
        {name: "Peter Himelheimer", activity: { montag: "FB", dienstag: "FB", mittwoch: "FB", donnerstag: "FB", freitag: "FB", samstag: "FB", sonntag: "FB", }},
    ]

    return (
        <div id="tasklist_background">
             <table id="tasklist_table">
                <thead>
                    <tr>
                        <th id="table_th_name"></th>
                        <th id="table_th">Montag</th>
                        <th id="table_th">Dienstag</th>
                        <th id="table_th">Mitwoch</th>
                        <th id="table_th">Donnerstag</th>
                        <th id="table_th">Freitag</th>
                        <th id="table_th">Samstag</th>
                        <th id="table_th">Sonntag</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tasks.map((item) => (
                            <tr>
                                <td id="table_td_name"><p>{item.name}</p></td>
                                <td id="table_td"><p id="table_td_text">{item.activity.montag}</p></td>
                                <td id="table_td"><p id="table_td_text">{item.activity.dienstag}</p></td>
                                <td id="table_td"><p id="table_td_text">{item.activity.mittwoch}</p></td>
                                <td id="table_td"><p id="table_td_text">{item.activity.donnerstag}</p></td>
                                <td id="table_td"><p id="table_td_text">{item.activity.freitag}</p></td>
                                <td id="table_td"><p id="table_td_text">{item.activity.samstag}</p></td>
                                <td id="table_td"><p id="table_td_text">{item.activity.sonntag}</p></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}