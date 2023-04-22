import {useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, signInWithGoogle } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import '../styles/login.css'

const Login = () => {
    const [user, loading, error] = useAuthState(auth)
    const navigate = useNavigate()

    useEffect(() => {
        if (loading) return
        if (user) navigate('/home')
        if(error) navigate('/')
    }, [user, loading, error, navigate])

    return (
        <div className="login">
            <div className="login__container">
                <button className="login__btn login__google" onClick={signInWithGoogle}>
                    Login with Google
                </button>
            </div>
        </div>
    )
}

export default Login