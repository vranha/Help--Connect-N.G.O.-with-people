import helpLogo from '../images/help_logo.png'
import helpLogoColor from '../images/help_logo_color.png'
import { useNavigate } from 'react-router-dom';

function Nav({ authToken, minimal, setShowModal, showModal, setIsSignUp }) {

    const navigate = useNavigate()

const handleClick = () => {
    setShowModal(true)
    setIsSignUp(false)
}   

const handleBack = () => {
    navigate('dashboarding')
}   


    return (
        <nav style={ { background: minimal &&"white"}}>
            <div className="logo-container" >
              <img className="logo" src={minimal ? helpLogoColor : helpLogo} alt="" />
            </div> 

            {!minimal && <button className="nav-button" onClick={handleClick} disabled={showModal} >Log in</button>}
            {minimal && <button className="nav-back" onClick={handleBack} disabled={showModal} >Back</button>}

        </nav>
    )
}

export default Nav;
