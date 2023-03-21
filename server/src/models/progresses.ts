import mongoose from "mongoose";
const schema = mongoose.Schema;
export enum progressLevel {
  finished = "Finished",
  inProgress = "In progress",
  notStarted = "Not started",
}
export interface progressDocument extends Document {
  taskId: string;
  progress: progressLevel;
}

let progress = new schema(
  {
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
  },
  {
    timestamps: true,
  }
);

const progresses = mongoose.model<progressDocument>("progress", progress);
export default progresses;
