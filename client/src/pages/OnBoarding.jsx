import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import axios from "axios";
import { useCookies } from "react-cookie";
import { BsUpload } from "react-icons/bs";
import { Image } from "cloudinary-react";
import Lottie from "react-lottie";
import loader from "../assets/loader.json";
import profile from "../assets/profile.json";

function OnBoarding() {
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);

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
        matches: "",
    });
    const [hasData, setHasData] = useState(false);

    const [fileInputState, setFileInputState] = useState("");
    const [previewSource, setPreviewSource] = useState("");
    const [imageId, setImageId] = useState("");
    const [imageLoading, setImageLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [disableUpdate, setDisableUpdate] = useState(false);
    const [uploaded, setUploaded] = useState(false);

    const navigate = useNavigate();

    const getUser = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/auth/user", { params: { userId } });

            console.log(response.data);
            setFormData(response.data);
            if (response.data.first_name.length > 0) {
                setHasData(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUser();
    }, [imageLoading]);

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        previewFile(file);
    };

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
            setDisableUpdate(true)
            setUploaded(false);
        };
    };

    const handleSubmitFile = (e) => {
        e.preventDefault();
        if (!previewSource) return;

        uploadImage(previewSource);
        setDisableUpdate(false)
    };

    const uploadImage = async (base64EncodedImage) => {
        console.log(base64EncodedImage);
        setImageLoading(true);
        try {
            await fetch("http://localhost:8000/api/auth/upload-image", {
                method: "POST",
                body: JSON.stringify({ data: base64EncodedImage, user: userId }),
                headers: { "Content-type": "application/json" },
            });

            setImageLoading(false);
            setUploaded(true)
        } catch (error) {
            console.error(error);
        }
    };

    const getImage = async () => {
        setLoading(true);
        try {
            const response = await axios("http://localhost:8000/api/auth/get-image", { params: { userId } });
            setImageId(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getImage();
    }, []);

    const handleSubmit = async (e) => {
        console.log("submitted", formData);
        e.preventDefault();
        try {
            const response = await axios.put("http://localhost:8000/api/auth/details", { formData });
            const success = response.status === 200;
             if (success) navigate('/dashboard/gallery')
            if (success) window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        console.log("e", e);
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        const name = e.target.name;
        console.log(imageId);
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
            //  url : imageId ? imageId : formData.url,
        }));
    };

    console.log(formData);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

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
                                    checked={formData.gender_identity === "Person"}
                                    value="Person"
                                    onChange={handleChange}
                                />
                                <label htmlFor="Person-gender-identity">Person</label>
                                <input
                                    type="radio"
                                    id="N.G.O.-gender-identity"
                                    name="gender_identity"
                                    checked={formData.gender_identity === "N.G.O."}
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
                                    checked={formData.gender_interest === "Person"}
                                    value="Person"
                                    onChange={handleChange}
                                />
                                <label htmlFor="Person-gender-interest">Person</label>
                                <input
                                    type="radio"
                                    id="N.G.O.-gender-interest"
                                    name="gender_interest"
                                    checked={formData.gender_interest === "N.G.O."}
                                    value="N.G.O."
                                    onChange={handleChange}
                                />
                                <label htmlFor="N.G.O.-gender-interest">N.G.O.</label>
                                <input
                                    type="radio"
                                    id="everyone-gender-interest"
                                    name="gender_interest"
                                    checked={formData.gender_interest === "everyone"}
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
                                    onChange={handleFileInputChange}
                                    value={fileInputState}
                                    // required={true}
                                />
                                <label htmlFor="url" style={{ fontSize: 18 }}>
                                    {" "}
                                    <BsUpload style={{ fontSize: 18, marginRight: 10 }} /> Choose Picture
                                </label>
                                <div className="photo-container">
                                    {previewSource && <img className="image" src={previewSource} alt="chosen" />}
                                    {!previewSource && !loading && imageId &&(
                                        <Image
                                            className="image"
                                            cloudName="dumpr6tqj"
                                            publicId={imageId}
                                            alt="imgchosen"
                                        />
                                   
                                    )}
                                    {!imageId && !previewSource && <Lottie
                                            options={{ animationData: profile, ...defaultOptions }}
                                            style={{ padding: 20 }}
                                        />}
                                    {loading && previewSource && (
                                        <Lottie
                                            options={{ animationData: loader, ...defaultOptions }}
                                            width={200}
                                            height={200}
                                            speed={2}
                                        />
                                    )}
                                </div>
                                {uploaded && <p style={{marginTop: "-10px"}}>Image uploaded 😍 </p>}
                                <button onClick={handleSubmitFile} disabled={!disableUpdate}>
                                    {" "}
                                    Upload
                                </button>
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
