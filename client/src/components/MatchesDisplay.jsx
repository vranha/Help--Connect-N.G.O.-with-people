import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie'



function MatchesDisplay({ matches, setClickedUser, clickedUser}) {
  const [matchedProfiles, setMatchedProfiles] = useState(null);
  const [active, setActive] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['user']);

    const matchedUserIds = matches.map(({ user_id }) => user_id);
    const userId = cookies.UserId

    const getMatches = async () => {
        try {
          const response = await axios.get("http://localhost:8000/api/auth/users", {
            params: { userIds: JSON.stringify(matchedUserIds) },
          });
          setMatchedProfiles(response.data);
        } catch (error) {
          console.log(error);
        }
      };


   useEffect(() => {
    getMatches();
  }, [matches]);


const filteredMatchesProfiles = matchedProfiles?.filter(matchedProfile => matchedProfile.matches.filter(profile => profile.user_id == userId).length > 0)

    return (
        <div className="matches-display">
            {filteredMatchesProfiles?.map((match, _index) =>(
                <div key={_index + match?.first_name } className={`match-card ${match?.first_name === clickedUser?.first_name ? "active" : ""}`} onClick={() => setClickedUser(match)}>
                    <div className="img-container">
                        <img src={match?.url} alt={match?.first_name + 'profile'}/>
                    </div>
                    <h3>{match?.first_name}</h3>
                </div>
            ))}
        </div>
    )
}

export default MatchesDisplay;

