
import { useEffect,  useState } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import Lottie from 'react-lottie'
import heart from '../assets/heart.json'
import chat from '../assets/chat.json'
// import confeti from '../assets/confeti.json'
import { TbArrowLeftRight } from "react-icons/tb";
import { AiOutlineLogout } from 'react-icons/ai';

function Dashboard({ user }) {
  const [ cookies, setCookie, removeCookie ] = useCookies(['user'])

  const [isStoppedLeft, setIsStoppedLeft] = useState(true);
  const [isStoppedRight, setIsStoppedRight] = useState(true);

  const navigate = useNavigate()

  const defaultOptions = {
    loop: false,
    autoplay: false,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  }

  const logout = () => {
    removeCookie('UserId', { path: '/' } )
    removeCookie('AuthToken', { path: '/' } )
    window.location.reload()
}

const userId = cookies.UserId

useEffect(() => {
    if (!userId) {
        navigate("/")
    }
}, [userId]);

    return (
      <Container>
      {/* {user &&  */}
      <i className="log-out-icon log-out-dashboard" onClick={logout}><AiOutlineLogout/></i>
      <div className="container">
         <div className="box box__left" onMouseEnter={() => setIsStoppedLeft(false)} onMouseLeave={() => setIsStoppedLeft(true)} onClick={() => navigate("/dashboard/chat")}>
           <div className="titleContainer">
             <h2 className="titleBox">Chat</h2>
           </div>
            <Lottie options={{ animationData: chat, ...defaultOptions }} width={110} height={110} style={{padding: 20}}  isStopped={isStoppedLeft} />
          </div>
          <div>
            <h2 className="or"><TbArrowLeftRight style={{fontSize: 104, marginTop:80}} /></h2>
          </div>
          <div className="box box__right" onMouseEnter={() => setIsStoppedRight(false)} onMouseLeave={() => setIsStoppedRight(true)} onClick={() => navigate("/dashboard/gallery")}>
          <div className="titleContainer">
            <h2 className="titleBox">Search</h2>
            {/* <Lottie options={{ animationData: confeti, ...defaultOptions }} width={320} height={320} style={{position: "relative",bottom:320, opacity: isStoppedRight ? 0 : 0.3, zIndex:0}} isStopped={isStoppedRight} /> */}
          </div>
            <Lottie options={{ animationData: heart, ...defaultOptions }} width={150} height={150} isStopped={isStoppedRight} />
          </div>
      </div>
      {/* } */}
      </Container>
    )
}

export default Dashboard;


const Container = styled.div`


  .container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--back);
  gap: 8%;
  }

  .or{
    font-style: normal;
    color: white;
    font-size: 40px;
    font-weight: 300;
  }

  .box{
    background-color: white;
    height: 200px;
    width: 180px;
    border: 6px solid white;
    border-radius: 10px;
    /* outline: 5px solid white; */
    box-shadow: 0 10px 30px #0000006a;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 0px;
    transition: 0.7s ease-in-out;
    z-index: 9;
    
    .titleContainer {
      height: 0px;
      z-index: 99999;
    }
    
    .titleBox {
      justify-self: start;
      font-style: normal;
      opacity: 0;
      transition: 0.7s ease-in-out;
      display: inline;
      text-transform: uppercase;
      letter-spacing: 4px;
      font-weight:400;
      position: relative;
    }

    @keyframes title {
  0%   {letter-spacing:1px;  bottom: 0px}
  25%  {letter-spacing:8px ; bottom: 10px}
  50%  {}
  75% {letter-spacing: 4px; bottom: 0px}
}
    
    &:hover {
      height: 280px;
      gap: 50px;
      
    }

    &:hover .titleBox{
      opacity: 1;
      animation-name: title;
      animation-duration: 2s;
    }

    &__left{
      transform: rotate(-5deg);

      &:hover {
      transform: rotate(-10deg);
      animation-name: rotateCardLeft;
      animation-duration: 1s;
    }
    }

    &__right{
      transform: rotate(5deg);
      
      &:hover {
      transform: rotate(10deg);
      animation-name: rotateCardRight;
      animation-duration: 1s;
    }

    

    }
    @keyframes rotateCardLeft {
  0%   {transform: rotate(-5deg) translateY(0px);}
  30%  {transform: rotate(-15deg) translateY(-30px);}
  100% {}
}
    @keyframes rotateCardRight {
  0%   {transform: rotate(5deg) translateY(0px);}
  30%  {transform: rotate(15deg) translateY(-30px);}
  100% {}
}

  }

`;
