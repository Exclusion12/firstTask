import mongoose from "mongoose";
const schema = mongoose.Schema;
let taskSchema = new schema({
    taskId: {
        type: String,
        unique: true,
        required: true,
    },
    taskName: {
        type: String,
        unique: true,
        required: true,
    },
}, {
    timestamps: true,
});
const tasks = mongoose.model("task", taskSchema);
export default tasks;
