import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { IoMdCloseCircleOutline } from 'react-icons/io'


const AuthModal = ({ setShowModal,  isSignUp }) => {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [error, setError] = useState(null)
    const [ cookies, setCookie, removeCookie] = useCookies(null)

    let navigate = useNavigate()

    console.log(email, password, confirmPassword)


    const handleClick = () => {
        setShowModal(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            if (isSignUp && (password !== confirmPassword)) {
                setError('Passwords need to match!')
                return
            }
            if (!isSignUp && (email === "")) {
                setError('Email and Password are required')
                return
            }
            if (!isSignUp && (password === "")) {
                setError('Email and Password are required')
                return
            }

            const { data } = await axios.post(`http://localhost:8000/api/auth/${isSignUp ? 'register' : 'login'}`, { email, password })

            
            const failed = data.status === false
            if (failed) {
                return setError(data.msg)
            }
            setCookie('AuthToken', data.token, { path: '/' })
            setCookie('UserId', data.userId, { path: '/' })
            
            const success = data.status === true
            if (success && isSignUp) navigate ('/onboarding')
            if (success && !isSignUp) navigate ('/dashboard')

            window.location.reload()

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div className="auth-modal">
            <div className="close-icon" onClick={handleClick}><IoMdCloseCircleOutline/></div>

            <h2>{isSignUp ? 'CREATE ACCOUNT': 'LOG IN'}</h2>
            <p>By clicking Log In, you agree to our terms. Learn how we process your data in our Privacy Policy and Cookie Policy.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email"
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="password"
                    required={true}
                    onChange={(e) =>{
                         setPassword(e.target.value)
                         if (isSignUp) {
                              if (e.target.value.length < 8) {
                            setError('Password needs minimum 8 characters')
                            return
                         }
                        
                        }
                        }}
                />
                {isSignUp && <input
                    type="password"
                    id="password-check"
                    name="password-check"
                    placeholder="confirm password"
                    required={true}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />}
                <input className="secondary-button" type="submit" value="SEND"/>
                <p style={{color: "rgb(190, 47, 47)", fontWeight: 600}} >{error}</p>
            </form>

            <hr/>
            <h2>GET THE APP</h2>

        </div>
    )
}
export default AuthModal