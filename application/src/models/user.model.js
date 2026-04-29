import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        },
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();

    try {
        const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (err) {
        next(err);
    }
});


userSchema.methods.comparePassword = async function (plainPassword) {
    if (!this.password) return false;
    return bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);


export default User
