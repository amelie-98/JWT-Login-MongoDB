import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const Schema = mongoose.Schema;

const emailValidator = (value) => /^.+@.+\..+$/.test(value);

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [emailValidator, 'incorrect email format'],
  },
  password: {
    type: String,
    required: true,
  },
});

//hash Password trước khi lưu vào db
userSchema.pre('save', async function (next) {
  // phải dùng function thay cho () => để dùng this @@
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(this.password, salt);
    this.password = passwordHash;
    next();
  } catch (err) {
    next(err);
  }
});

//giải mã hash Pasword trong db rồi so sánh lúc đăng nhập
userSchema.methods.isPasswordValid = async function (value) {
  try {
    return await bcrypt.compare(value, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

export default mongoose.model('users', userSchema);
