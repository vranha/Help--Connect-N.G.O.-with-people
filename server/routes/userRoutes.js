const { register, getUser, getUsers, getGenderedUsers, addMatch, addDislike, login, logout, details, uploadImage, getImage } = require("../controllers/userController")


const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.put("/details", details);

router.get("/user", getUser);
router.get("/users", getUsers);
router.get("/gendered-users", getGenderedUsers);
router.put("/addmatch", addMatch);
router.put("/adddislike", addDislike);
router.post("/upload-image", uploadImage);
router.get("/get-image", getImage);


module.exports = router