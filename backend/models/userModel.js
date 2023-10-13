const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a name"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please add a email"],
            trim: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, "Please add a password"],
            minLength: [6, "Must be up to 6 characters"],
            maxLength: [25, "Must not be more than 25 characters"],
            trim: true
        },
        photo: {
            type: String,
            required: [true, "Please add a photo"],
            default: 'https://us.123rf.com/450wm/tuktukdesign/tuktukdesign1606/tuktukdesign160600119/59070200-icono-de-usuario-hombre-perfil-hombre-de-negocios-avatar-icono-persona-en-la-ilustraci%C3%B3n.jpg',
            trim: true,
        },
       
        phone: {
            type: String,
            default: "+312 0000 0000",
        },
        description: {
            type: String,
            required: [250, "tell me about yourself"],
            default: 'Info',
        },

    },

    {
        timestamps: true,
    }
);

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// UserSchema.methods.comprobarPassword = async function (passwordFormulario) {
//     return await bcrypt.compare(passwordFormulario, this.password);
// };




const User = mongoose.model("User", UserSchema);
module.exports = User;