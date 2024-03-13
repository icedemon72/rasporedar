import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const professorSchema = mongoose.Schema(
  {
    name: {
      type: String
    },
    title: {
      type: String
    },
    institution: {
      type: ObjectId,
      index: true,
      ref: 'institution'
    },
    education: {
      bachelor: {
        institution: { type: String },
        from: { type: String },
        to: { type: String }
      },
      master: {
        institution: { type: String },
        from: { type: String },
        to: { type: String }
      },
      doctorate: {
        institution: { type: String },
        from: { type: String },
        to: { type: String }
      }
    },
    bio: {
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

const Professor = mongoose.model('Professor', professorSchema);

export default Professor;