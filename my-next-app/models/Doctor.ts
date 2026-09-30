import mongoose, { Schema, Document, Model } from 'mongoose';
import { IDoctorScheduleSlot } from '@/types';

export interface IDoctorDocument extends Document {
  userId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  qualification: string;
  consultationFee: number;
  availableTimings: IDoctorScheduleSlot[];
  contactInformation: {
    phone: string;
    email: string;
    roomNumber: string;
  };
  isAvailable: boolean;
  rating: number;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ScheduleSlotSchema = new Schema(
  {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    startTime: {
      type: String, // "09:00"
      required: true,
    },
    endTime: {
      type: String, // "17:00"
      required: true,
    },
    slotDurationMinutes: {
      type: Number,
      default: 30,
    },
  },
  { _id: false }
);

const DoctorSchema = new Schema<IDoctorDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    name: {
      type: String,
      required: [true, 'Please provide doctor name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide doctor email'],
      trim: true,
      lowercase: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, 'Please specify specialization'],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, 'Please provide years of experience'],
      min: [0, 'Experience cannot be negative'],
    },
    qualification: {
      type: String,
      required: [true, 'Please provide doctor qualification'],
      trim: true,
    },
    consultationFee: {
      type: Number,
      required: [true, 'Please set consultation fee'],
      min: [0, 'Fee cannot be negative'],
      default: 50,
    },
    availableTimings: {
      type: [ScheduleSlotSchema],
      default: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30 },
        { day: 'Tuesday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30 },
        { day: 'Wednesday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30 },
        { day: 'Thursday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30 },
        { day: 'Friday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30 },
      ],
    },
    contactInformation: {
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      roomNumber: { type: String, default: 'Consulting Suite 1' },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    bio: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

DoctorSchema.index({ specialization: 1, isAvailable: 1 });
DoctorSchema.index({ name: 'text', specialization: 'text' });

export const Doctor: Model<IDoctorDocument> =
  mongoose.models.Doctor || mongoose.model<IDoctorDocument>('Doctor', DoctorSchema);

export default Doctor;
