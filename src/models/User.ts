import bcrypt from 'bcryptjs';
import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type CallbackWithoutResultAndOptionalError,
} from 'mongoose';

export interface UserDocument {
  email: string;
  password: string;
  role?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (this: HydratedDocument<UserDocument>, next: CallbackWithoutResultAndOptionalError) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = models.User || model<UserDocument>('User', userSchema);

export default User;
