import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const inInstitutionSchema = mongoose.Schema(
  {
    user: { 
      type: ObjectId
    },
    institution: {
      type: ObjectId
    },
    left: { // whether the user left institution for some reason
      type: Boolean,
      default: false
    },
    role: { // User -> can see schedules, Mod -> can edit them
      type: String,
      default: 'User'
    }
  },
  {
    timestamps: true
  }
);

const InInstitution = mongoose.model('InInstitution', inInstitutionSchema);

export default InInstitution;