import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true
    },
    email: {
      type: String,
      lowercase: true
    },
    password: {
      type: String
    },
    name: {
      type: String
    },
    role: {
      type: String,
      default: 'User'
    },
  }, 
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

export default User;