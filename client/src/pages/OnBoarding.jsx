import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import Nav from "../components/Nav";
import axios from 'axios';
import { useCookies } from 'react-cookie'
import { BsUpload } from "react-icons/bs";
import { Image } from 'cloudinary-react'

function OnBoarding() {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);

    const userId = cookies.UserId;

    const [formData, setFormData] = useState({
        user_id: cookies.UserId,
        first_name: "",
        dob_day: "",
        dob_month: "",
        dob_year: "",
        show_gender: "",
        gender_identity: "",
        gender_interest: "",
        url: "",
        about: "",
        matches: ""

    })
    const [hasData, setHasData] = useState(false)

    const navigate = useNavigate()

    const getUser = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/auth/user", { params: { userId } });

            console.log(response.data);
            setFormData(response.data)
            if (response.data.first_name.length > 0) {
                setHasData(true)
            }

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);


    const uploadFile = (files) => {
        const data = new FormData()
        data.append("file", files[0])
        data.append("upload_preset", "usg1rnck")
        data.append("cloud_name", "dumpr6tqj")
        data.append('folder', 'userImages');

        var uploadOptions = {
            params : {
              'public_id': userId,
              api_key : '768398349842437',
              api_secret : '6_je4z3D_hnbWwDgo1TkWKWRRww'
            }
        }
       axios.put("https://api.cloudinary.com/v1_1/dumpr6tqj/image/upload", data, uploadOptions)
       .then((response) => {
           console.log(response)
       })
    }



    const handleSubmit = async (e) => {
        console.log("submitted");
        e.preventDefault();
        try {
            const response = await axios.put('http://localhost:8000/api/auth/details', { formData })
            const success = response.status === 200
            if (success) navigate('/dashboard')
            if (success) window.location.reload()

        } catch (error) {
            console.log(error)
        }
    };

    const handleChange = (e) => {
        console.log("e", e);
        const value = e.target.type === 'checkbox' ?  e.target.checked : e.target.type === 'file' ? e.target.files[0] : e.target.value
        const name = e.target.name

        setFormData((prevState) => ({
            ...prevState,
            [name] : value
        }))
    };

    console.log(formData)

    return (
        <>
            <Nav minimal={true} setShowModal={() => {}} showModal={false} />
            <div className="onboarding">
                {!hasData ? <h2>CREATE ACCOUNT</h2> : <h2>MODIFY DATA</h2>}

                <form onSubmit={handleSubmit}>
                    <div className="form-box">
                        <section>
                            <label htmlFor="first_name">First Name</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                placeholder="First Name"
                                required={true}
                                value={formData.first_name}
                                onChange={handleChange}
                            />
                            <label>Birthday</label>
                            <div className="multiple-input-container">
                            <input
                                type="number"
                                id="dob_day"
                                name="dob_day"
                                placeholder="DD"
                                required={true}
                                value={formData.dob_day}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                id="dob_month"
                                name="dob_month"
                                placeholder="MM"
                                required={true}
                                value={formData.dob_month}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                id="dob_year"
                                name="dob_year"
                                placeholder="YYYY"
                                required={true}
                                value={formData.dob_year}
                                onChange={handleChange}
                            />
                            </div>
                            <label>I am a...</label>
                            <div className="multiple-input-container">
                                <input
                                    type="radio"
                                    id="Person-gender-identity"
                                    name="gender_identity"
                                    checked={formData.gender_identity === 'Person'}
                                    value="Person"
                                    onChange={handleChange}
                                />
                                <label htmlFor="Person-gender-identity">Person</label>
                                <input
                                    type="radio"
                                    id="N.G.O.-gender-identity"
                                    name="gender_identity"
                                    checked={formData.gender_identity === 'N.G.O.'}
                                    value="N.G.O."
                                    onChange={handleChange}
                                />
                                <label htmlFor="N.G.O.-gender-identity">N.G.O.</label>
                            </div>
                            <label htmlFor="show-gender">Show gender on my profile</label>
                            <input
                                type="checkbox"
                                id="show-gender"
                                name="show_gender"
                                checked={formData.show_gender}
                                onChange={handleChange}
                            />
                            <label>Show Me</label>
                            <div className="multiple-input-container">
                                <input
                                    type="radio"
                                    id="Person-gender-interest"
                                    name="gender_interest"
                                    checked={formData.gender_interest === 'Person'}
                                    value="Person"
                                    onChange={handleChange}
                                />
                                <label htmlFor="Person-gender-interest">Person</label>
                                <input
                                    type="radio"
                                    id="N.G.O.-gender-interest"
                                    name="gender_interest"
                                    checked={formData.gender_interest === 'N.G.O.'}
                                    value="N.G.O."
                                    onChange={handleChange}
                                />
                                <label htmlFor="N.G.O.-gender-interest">N.G.O.</label>
                                <input
                                    type="radio"
                                    id="everyone-gender-interest"
                                    name="gender_interest"
                                    checked={formData.gender_interest === 'everyone'}
                                    value="everyone"
                                    onChange={handleChange}
                                />
                                <label htmlFor="everyone-gender-interest">All</label>
                            </div>
                        </section>
                        <section className="sectionTwo">
                            <div className="sectionTwo-box">
                                <input
                                    type="file"
                                    name="url"
                                    id="url"
                                    onChange={(event) => uploadFile(event.target.files)}
                                    // required={true}
                                />
                                <label htmlFor="url" style={{fontSize: 18}}> <BsUpload style={{fontSize: 18, marginRight: 10}} /> Upload Picture</label>
                                <div className="photo-container">
                                     {/* <img src={formData.url ? formData.url : "https://icon-library.com/images/default-user-icon/default-user-icon-26.jpg" } alt="profile pic preview" /> */}
                                     <Image cloudName="dumpr6tqj" publicId={`https://res.cloudinary.com/dumpr6tqj/image/upload/v1654688336/userImages/${userId}.png`} />
                                </div>
                            </div>
                            <label htmlFor="about"></label>
                            <input
                                type="text"
                                id="about"
                                name="about"
                                required={true}
                                placeholder="I like long walks..."
                                value={formData.about}
                                onChange={handleChange}
                            />
                        </section>
                    </div>
                        <input type="submit" />
                </form>
            </div>
        </>
    );
}

export default OnBoarding;
