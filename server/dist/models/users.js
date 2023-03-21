import mongoose from "mongoose";
const schema = mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose";
let userSchema = new schema({
    firstname: {
        type: String,
        default: "",
    },
    lastname: {
        type: String,
        default: "",
    },
    admin: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
userSchema.plugin(passportLocalMongoose);
const users = mongoose.model("user", userSchema);
export default users;
