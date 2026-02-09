import { Schema, model, models } from 'mongoose';

export interface OTPDocument {
  email: string;
  otp: string;
  createdAt: Date;
}

const otpSchema = new Schema<OTPDocument>({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

const OTP = models.OTP || model<OTPDocument>('OTP', otpSchema);

export default OTP;
