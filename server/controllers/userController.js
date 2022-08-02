const User = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { cloudinary } = require('../utils/cloudinary')


// Sign up to the Database

module.exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const emailCheck = await User.findOne({ email });

        if (emailCheck) return res.json({ msg: "Email already used", status: false });

        const generatedUserId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            user_id: generatedUserId,
            email,
            password: hashedPassword,
        });
        delete user.password;
        const token = jwt.sign(user.toJSON(), email, {
            expiresIn: 60 * 24,
        });
        return res.json({ status: true, user, userId: generatedUserId, token });
    } catch (ex) {
        next(ex);
    }
};

// Log in to the Database

module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.json({ msg: "Incorrect username or password", status: false });
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return res.json({ msg: "Incorrect username or password", status: false });
        delete user.password;

        if (user && isPasswordValid) {
            const token = jwt.sign(user.toJSON(), email, {
                expiresIn: 60 * 24,
            });
            res.json({ status: true, user, userId: user.user_id, token });
        }
    } catch (ex) {
        next(ex);
    }
};

module.exports.logout = async (req, res, next) => {};

// Update a User in the Database

module.exports.details = async (req, res, next) => {
    try {
        const formData = req.body.formData;

        const query = { user_id: formData.user_id };

        const updateDocument = {
            $set: {
                first_name: formData.first_name,
                dob_day: formData.dob_day,
                dob_month: formData.dob_month,
                dob_year: formData.dob_year,
                show_gender: formData.show_gender,
                gender_identity: formData.gender_identity,
                gender_interest: formData.gender_interest,
                url: formData.url,
                about: formData.about,
                matches: formData.matches,
            },
        };

        const insertedUser = await User.updateOne(query, updateDocument);

        res.json(insertedUser);
    } catch (ex) {
        next(ex);
    }
};

// Get individual user

module.exports.getUser = async (req, res, next) => {
    const userId = req.query.userId;

    try {
        const query = { user_id: userId };
        const user = await User.findOne(query);
        res.send(user);
    } catch (ex) {
        next(ex);
    }
};

// Get all the Gendered Users in the Database

module.exports.getGenderedUsers = async (req, res, next) => {
    const gender = req.query.gender;

    try {
        if (gender === "everyone") {
            const foundUsers = await User.find();
            res.json(foundUsers);
        } else {
            const query = { gender_identity: { $eq: gender } };

            const foundUsers = await User.find(query);
            res.json(foundUsers);
        }
    } catch (ex) {
        next(ex);
    }
};

// Update User with a match

module.exports.addMatch = async (req, res, next) => {
    const { userId, matchedUserId } = req.body;

    try {
        const query = { user_id: userId };
        const updateDocument = {
            $push: { matches: { user_id: matchedUserId } },
        };
        const user = await User.updateOne(query, updateDocument);
        res.send(user);
    } catch (ex) {
        next(ex);
    }
};
// Update User with a dislike

module.exports.addDislike = async (req, res, next) => {
    const { userId, matchedUserId } = req.body;

    try {
        const query = { user_id: userId };
        const updateDocument = {
            $push: { dislikes: { user_id: matchedUserId } },
        };
        const user = await User.updateOne(query, updateDocument);
        res.send(user);
    } catch (ex) {
        next(ex);
    }
};

module.exports.getUsers = async (req, res, next) => {
    const userIds = JSON.parse(req.query.userIds);

    try {
        const pipeline = [
            {
                $match: {
                    user_id: {
                        $in: userIds,
                    },
                },
            },
        ];

        const foundUsers = await User.aggregate(pipeline);

        res.json(foundUsers);
    } catch (ex) {
        next(ex);
    }
};




module.exports.getImage = async (req, res) => {
    const userId = req.query.userId;
    
console.log(userId);
    const { resources } = await cloudinary.search.expression(`public_id:help_web_images/${userId}`)
    .sort_by('public_id', 'desc')
    .max_results(30)
    .execute();
    const publicIds = resources.map((file) => file.secure_url)
    res.send(publicIds[0])
    try {
       

    } catch (error) {
        console.error(error);
        
    }
};



module.exports.uploadImage = async (req, res) => {

    try {
        const fileStr = req.body.data;
        const userId = req.body.user
        const uploadedResponse = await cloudinary.uploader.
        upload(fileStr, {
            upload_preset: 'help_setup',
            public_id: userId,
            overwrite: true
        })
        console.log(uploadedResponse)

        const query = { user_id: userId };

        const updateDocument = {
            $set: {
                url: uploadedResponse.secure_url,
            },
        };

        const insertedUser = await User.updateOne(query, updateDocument);

        res.json({insertedUser, msg: "YAYAYAYA" })
    } catch (error) {
        console.error(error);
        res.status(500).json({err: 'Something went wrong'})
    }
};



// module.exports.getImages = async (req, res) => {

//     const { resources } = await cloudinary.search.expression('folder:help_web_images')
//     .sort_by('public_id', 'desc')
//     .max_results(30)
//     .execute();
//     const publicIds = resources.map((file) => file.public_id)
//     res.send(publicIds)
//     try {
       

//     } catch (error) {
//         console.error(error);
        
//     }
// };



