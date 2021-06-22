import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { authService } from '../services/authService';
import '../style/logout.css';

export default function Logout() {
    const history = useHistory();

    useEffect(() => {
        try {
            authService.logout();
            window.sessionStorage.clear();
            setTimeout(() => {history.push("/login"); window.location.reload()}, 1000);
        } catch(error) {
            alert(error);
        }
    })
    

    return (
        <div>
            <div className="logout_loader"></div>
            <h1 className="logout_text">Logged out....</h1>
        </div>
    );
}