// models/User.model.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',  // Reference to the Menu model
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        min: [1, 'Quantity must be at least 1'],
      },
    },
  ],
  role:{
    type: String,
    enum: ['owner', 'user'],
    default: 'user',
  }
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;
