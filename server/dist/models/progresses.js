import mongoose from "mongoose";
const schema = mongoose.Schema;
export var progressLevel;
(function (progressLevel) {
    progressLevel["finished"] = "Finished";
    progressLevel["inProgress"] = "In progress";
    progressLevel["notStarted"] = "Not started";
})(progressLevel || (progressLevel = {}));
let progress = new schema({
    progress: {
        type: String,
        enum: progressLevel,
        default: progressLevel.notStarted,
        required: true,
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "task",
    },
}, {
    timestamps: true,
});
const progresses = mongoose.model("progress", progress);
export default progresses;
