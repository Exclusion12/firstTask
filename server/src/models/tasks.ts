import mongoose from "mongoose";
const schema = mongoose.Schema;

export interface taskDocument extends Document {
  _id: string;
  taskId: string;
  taskName: string;
}
let taskSchema = new schema(
  {
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
  },
  {
    timestamps: true,
  }
);

const tasks = mongoose.model<taskDocument>("task", taskSchema);
export default tasks;
