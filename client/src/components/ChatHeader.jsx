import { AiOutlineLogout } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";



const ChatHeader = ({ user, logout, isGallery, isChat }) => {


    let navigate = useNavigate();


    return (

        <div className="chat-container-header">
            
            <div className="profile" onClick={() => navigate('/onboarding')}>
                <div className="img-container">
                    <img src={user.url} alt={"photo of " + user.first_name}/>
                </div>
                <h3>{user.first_name}</h3>
            </div>
            <div className="link-box">
                <Link to={"/dashboard"}>Home</Link>
            </div>
            {isGallery && <div className="link-box">
                <Link to={"/dashboard/chat"}>Chat</Link>
            </div>}
            {isChat && <div className="link-box">
                <Link to={"/dashboard/gallery"}>Gallery</Link>
            </div>}
            <i className="log-out-icon" onClick={logout}><AiOutlineLogout/></i>
        </div>


    )
}

export default ChatHeader