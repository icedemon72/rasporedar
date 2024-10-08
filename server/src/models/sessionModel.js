import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const sessionSchema = mongoose.Schema(
  {
    user: {
      type: ObjectId,
      required: true,
      index: true
    },
    refreshToken: {
      type: String,
      required: true,
      index: true
    },
    active: {
      type: Boolean
    },
    userAgent: {
      type: String
    }
  }, {
  timestamps: true
}
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;