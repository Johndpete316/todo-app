import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate }  from 'react-router-dom'
import { collection, query, getDocs, where } from 'firebase/firestore'
import { auth, db, logout } from '../firebase'
import '../styles/home.css'


const Home = () => {

    const [user, loading, error] = useAuthState(auth)
    const navigate = useNavigate()


    useEffect(() => {
        if (loading) return
        if (!user) navigate('/')
    }, [user, loading])


    return (
        <div className="dashboard">
            <div className="dashboard__container">
                Logged in as
                <div>{user?.displayName}</div>
                <div>{user?.email}</div>
                <button className='dashbord__btn' onClick={logout}>Logout</button>
            </div>
        </div>
    )
}

export default Home