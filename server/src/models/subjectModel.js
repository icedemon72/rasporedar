import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const subjectSchema = mongoose.Schema(
  {
    institution: {
      type: ObjectId,
      required: true
    },
    professors: {
      type: [ ObjectId ],
      index: true
    },
    assistents: {
      type: [ ObjectId ],
      index: true
    },
    name: {
      type: String
    },
    description: {
      type: String
    },
    goal: {
      type: String
    },
    result: {
      type: String
    },
    references: {
      type: [ String ]
    },
    deleted: {
      type: Boolean,
      default: false
    }
  }
);

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;