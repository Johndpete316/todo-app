import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, logout } from '../firebase'
import '../styles/navbar.css'

const Navbar = () => {

    const [user, loading, error] = useAuthState(auth)
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    }

    const handleLogout = () => {
        logout();
    }

    if(loading) return <div>Loading...</div>
    if(!user) return <div>Not logged in</div>
    


    return (
        <div className="navbar">
            //todo app
            <div>
                <div className="profile-image-container" onClick={toggleDropdown}>
                    <img
                    src={user.photoURL ? user.photoURL : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                    alt={user.displayName ? user.displayName : "User"}
                    className="profile-image"
                    />
                    <span className={`arrow${showDropdown ? " arrow-up" : ""}`}></span>
                </div>
                <div className={`dropdown${showDropdown ? " show-dropdown" : ""}`}>
                    <div>
                        <strong>{user.displayName}</strong>
                    </div>
                    <div>{user.email}</div>
                    <a onClick={handleLogout}>Logout</a>
                </div>
            </div>
        </div>
    );
};

export default Navbar;




