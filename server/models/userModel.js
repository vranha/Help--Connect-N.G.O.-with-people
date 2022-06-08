const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50,
    },
    password: {
        type: String,
        required: true,
        min: 8,
    },
    about: {
        type: String,
        min: 20,
    },
    dob_day: {
        type: Number,
    },
    dob_month: {
        type: Number,
    },
    dob_year: {
        type: Number,
    },
    first_name: {
        type: String,
    },
    gender_identity: {
        type: String,
    },
    gender_interest: {
        type: String,
    },
    matches: {
        type: [],
    },
    dislikes: {
        type: [],
    },
    show_gender: {
        type: Boolean,
    },
    url: {
        type: String,
        default: "https://icon-library.com/images/default-user-icon/default-user-icon-26.jpg",
    },
});

module.exports = mongoose.model("Users", userSchema);
