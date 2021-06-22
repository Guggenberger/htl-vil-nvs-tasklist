import React, { useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { authService } from '../services/authService.js';
import { useHistory } from'react-router-dom';
import {userService} from '../services/userService';
import {setSortState, getSortState, setSortStateLast} from '../components/SortState.js';

const UserTable = () => { 
    const [users, setUsers] = useState([{ }]);
    const history = useHistory();


    useEffect(() => {
        let pollingJob = null;

        function clearnUpEffect() {
            stopHTTPPolling();
            console.log('useEffect cleanup run. Polling Job stopped.');
        }

        function startHTTPPolling() {
            pollingJob = setInterval(reloadUsers, 1000);
        }

        function stopHTTPPolling() {
            clearInterval(pollingJob);
            pollingJob = null;
        }

        function reloadUsers() {
            console.log("polling/users");
           
            userService.getAll()
            .then(_users => { 
                setUsers(_users); 
            })
            .catch(err => {
                stopHTTPPolling();
                console.log(`Loading users failed.`, err);
            });
        }

        reloadUser();
        startHTTPPolling();
        //return clearnUpEffect();
 
    }, []);

    const table = [
        {key: '_id',        label: 'ID'},
        {key: 'firstname',  label: 'Firstname', sortable: true},
        {key: 'lastname',   label: 'Lastname',  sortable: true},
        {key: 'age',        label: 'Age',       sortable: true},
        {key: 'state',      label: 'State',     sortable: true, color: 'green'},
        {key: 'username',   label: 'User',      sortable: true},
        {key: 'gender',     label: 'Gender',    sortable: true},
    ]

    const _delete = (user) => {
        userService.delete(user._id).then(() => {
            let usersWithoutTheDeleted = users.filter(u => u._id !== user._id);
            setUsers(usersWithoutTheDeleted);
        })
    }

    const setDefaultUsers = () => {
        userService.setDefaultUsers().then(() => {
            reloadUser();
        });
    }
    
    const sortBy = (sortkrit) => {
        var lastone = "";
        if (getSortState().last == "") {
            lastone = sortkrit;
        } else {
            lastone = getSortState().last;
        }

        userService.getAll().then(users => { 

            if (getSortState().key != sortkrit) { 
                setSortState(1, sortkrit);
                setSortStateLast(sortkrit);
            } else {
                if (getSortState().aktState == 1) {
                    setSortState(0, sortkrit);
                } else if (getSortState().aktState == 0) { 
                    setSortState(-1, sortkrit);     
                } else if (getSortState().aktState == -1) {
                    setSortState(1, sortkrit);   
                }
            }
            
            if (getSortState().aktState == 1) {
                setUsers(users.sort((a, b) => (a[sortkrit] > b[sortkrit]) ? 1 : -1));
                document.getElementById(sortkrit).className = "bi bi-arrow-up"; 
            } else if (getSortState().aktState == -1) {
                setUsers(users.sort((a, b) => (a[sortkrit] < b[sortkrit]) ? 1 : -1));
                document.getElementById(sortkrit).className = "bi bi-arrow-down";
            } else {
                setUsers(users); 
                document.getElementById(sortkrit).className = "bi bi-arrow-down-up";
            }

            if (lastone != getSortState().last) {
                document.getElementById(lastone).className = "bi bi-arrow-down-up"; 
            }
                 
        });
    }

    function setIcon(headerCol) {
        if (headerCol.sortable) {
            return <i id={headerCol.key} className="bi bi-arrow-down-up"></i>;
        }
    }

    function reloadUser() {
        userService.getAll().then(users => { 
            setUsers(users);         
        });    
    }

    const openUserForm = (subUrl) => {
        history.push(`/forms/${subUrl}`);
    }

    const getStateIcon = (state) => {
        var className = "";
        if (state == 'online') {
            className = "text-success";
        } else if (state == 'offline') {
            className = "text-danger";
        } 
        return "bi bi-circle-fill " + className;
    }

    async function chat(user) {
        var u = await authService.getCurrentUser();
        alert(u.username + " wants to write to " + user.username);
    }

    return (
        <div className="table-responsive">
            <table className="table table-hover table-borderless table-sm ">
                <thead>
                    <tr>
                        {table.map(headerCol => (
                            <th key={`th_${headerCol.key}`} onClick={() =>{ if (headerCol.sortable) { sortBy(headerCol.key); }}}>
                                <span className='sortable-column-label'> {headerCol.label} </span>
                                <span className='sortable-column-symbol'>
                                    { setIcon(headerCol) }                              
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>
                
                <tbody>
                    {users.map(u => (
                        <tr key={`tr_${u._id}`} /*onClick={() => openUserForm(u._id)*/ >
                            <th scope="row" key={`th_${u._id}`}>{u._id}</th>        
                            <td>{u.firstname}</td>
                            <td>{u.lastname}</td>
                            <td>{u.age}</td>
                            <td>{u.state}  <i className={getStateIcon(u.state)}></i></td>
                            <td>{u.username}</td>
                            <td>{u.gender}</td>

                            <td>
                                <button
                                    className="btn btn-sm btn-info"
                                    type="button"
                                    onClick={() => {chat(u)}}>
                                    Chat
                                </button>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
           { /*
            <button 
                type="button" 
                className="btn btn-primary" 
                onClick={setDefaultUsers}
                >Set default user
            </button>
            <button
                type="button"
                className="btn btn-secondary btn-in-list"
                onClick={() => openUserForm("new")}
                >Add new User
            </button>
            */ }
        </div>
    ) 
} 

export default UserTable; 