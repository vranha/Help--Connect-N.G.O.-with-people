import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ChatHeader from "../components/ChatHeader";
import helpLogo from "../images/help_logo.png";
import Lottie from "react-lottie";
import pidgeon from "../assets/pidgeon.json";

function CardGallery({ user, setUser }) {
    const [genderedUsers, setGenderedUsers] = useState(null);
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);

    const userId = cookies.UserId;

    let navigate = useNavigate();

    const logout = () => {
        removeCookie("UserId", { path: "/" });
        removeCookie("AuthToken", { path: "/" });
        window.location.reload();
    };

    useEffect(() => {
        if (!userId) {
            navigate("/");
        }
    }, [userId]);

    const getUser = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/auth/user", { params: { userId } });

            setUser(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getGenderedUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/auth/gendered-users", {
                params: { gender: user?.gender_interest },
            });
            setGenderedUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if (user) {
            getGenderedUsers();
        }
    }, [user]);

    const updatedMatches = async (matchedUserId, action) => {
        try {
            await axios.put(`http://localhost:8000/api/auth/${action}`, {
                userId,
                matchedUserId,
            });
            getUser();
        } catch (error) {
            console.log(error);
        }
    };

    console.log(user);

    const swiped = (direction, swipedUserId) => {
        if (direction === "right") {
            updatedMatches(swipedUserId, "addmatch");
        }
        if (direction === "left") {
            updatedMatches(swipedUserId, "adddislike");
        }
    };

    const matchedUserIds = user?.matches.map(({ user_id }) => user_id).concat(userId);
    const dislikedUserIds = user?.dislikes.map(({ user_id }) => user_id).concat(userId);

    const filteredGenderedUsersMatches = genderedUsers?.filter(
        (genderedUser) => !matchedUserIds?.includes(genderedUser.user_id)
    );
    const filteredGenderedUsers = filteredGenderedUsersMatches?.filter(
        (genderedUser) => !dislikedUserIds?.includes(genderedUser.user_id)
    );

    const defaultOptions = {
        loop: true,
        autoplay: true,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <>
            {user && (
                <div className="swiper-container">
                    <ChatHeader user={user} logout={logout} isGallery={true} />
                    <div className="card-container">
                        <img className="logo-gallery" src={helpLogo} alt="" />
                        {filteredGenderedUsers?.map((genderedUser) => (
                            <div className="swipe" key={uuidv4()}>
                                <div style={{ backgroundImage: "url(" + genderedUser.url + ")" }} className="card">
                                    <div className="details">
                                        <h3>{genderedUser.first_name}</h3>
                                        <p>{genderedUser.about}</p>
                                    </div>
                                </div>
                                <div className="swiper-buttons">
                                    <button
                                        className="swiper-buttons-no"
                                        onClick={() => swiped("left", genderedUser.user_id)}
                                    >
                                        Not for me
                                    </button>
                                    <button
                                        className="swiper-buttons-yes"
                                        onClick={() => swiped("right", genderedUser.user_id)}
                                    >
                                        I like it!
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filteredGenderedUsers?.length === 0 && (
                            <div className="gallery-zero">
                                <h2>Don't be impatient</h2>
                                <h4><span>Soon</span> you will have more results </h4>
                                <Lottie
                                    options={{ animationData: pidgeon, ...defaultOptions }}
                                    width={200}
                                    height={200}
                                />
                            </div>
                        )}

                        <div className="swipe-info">
                            {/* {lastDirection ? <p>You swiped {lastDirection}</p> : <p/>} */}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CardGallery;
