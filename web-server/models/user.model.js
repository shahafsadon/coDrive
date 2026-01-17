const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            default: "",
        },
        phoneNumber: {
            type: String,
            default: "",
        },
        birthDate: {
            type: String,
            default: "",
        },
        image: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// --- Model ---
const User = mongoose.model('User', userSchema);

// --- API compatible functions ---

// Create new user
async function createUser({
                              username,
                              password,
                              fullName,
                              email,
                              phoneNumber,
                              birthDate,
                              image,
                          }) {
    const user = new User({
        username,
        password,
        fullName,
        email,
        phoneNumber,
        birthDate,
        image,
    });

    const savedUser = await user.save();

    // IMPORTANT: expose id (not _id) to keep API & JWT compatible
    return {
        id: savedUser._id.toString(),
        username: savedUser.username,
        password: savedUser.password,
        fullName: savedUser.fullName,
        email: savedUser.email,
        phoneNumber: savedUser.phoneNumber,
        birthDate: savedUser.birthDate,
        image: savedUser.image,
    };
}

// Find user by username
async function findUserByUsername(username) {
    const user = await User.findOne({ username }).lean();
    if (!user) return null;

    return {
        id: user._id.toString(),
        ...user,
    };
}

// Find user by ID
async function findUserById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }

    const user = await User.findById(id).lean();
    if (!user) return null;

    return {
        id: user._id.toString(),
        ...user,
    };
}

module.exports = {
    createUser,
    findUserByUsername,
    findUserById,
};
