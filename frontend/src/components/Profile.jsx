import React, { useState, useEffect} from 'react';
import { authService } from '../services/authService';
import '../style/profil.css';

export default function Profil() {
    const [user, setUser] = useState([{ }]);

    async function currentUser() {
        await authService.getCurrentUser().then(user => { setUser(user);});
    }

    currentUser();

    return (
        <div>
            <div >                   
                <p style={{marginTop: "100px"}} id="profile_text">{user.firstname}</p>
                <p id="profile_text">{user.lastname}</p>
                <p id="profile_text">{user.age}</p>
                <p id="profile_text">{user.state}</p>
                <p id="profile_text">{user.username}</p>
                <p id="profile_text">{user.gender}</p>
            </div>
        </div>
    );
}