import mongoose, { Schema, Document, Model } from 'mongoose';
import { Gender } from '@/types';

export interface IPatientDocument extends Document {
  userId?: mongoose.Types.ObjectId;
  fullName: string;
  age: number;
  gender: Gender;
  phoneNumber: string;
  email: string;
  address: string;
  bloodGroup?: string;
  emergencyContact?: string;
  medicalHistory: string[];
  allergies?: string[];
  currentMedications?: string[];
  registrationDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new Schema<IPatientDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    fullName: {
      type: String,
      required: [true, 'Please provide patient full name'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    age: {
      type: Number,
      required: [true, 'Please provide patient age'],
      min: [0, 'Age must be 0 or greater'],
      max: [130, 'Age must be realistic'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: [true, 'Please select gender'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide contact phone number'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide patient email'],
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide address'],
      trim: true,
    },
    bloodGroup: {
      type: String,
      trim: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown', ''],
      default: 'Unknown',
    },
    emergencyContact: {
      type: String,
      trim: true,
      default: '',
    },
    medicalHistory: {
      type: [String],
      default: [],
    },
    allergies: {
      type: [String],
      default: [],
    },
    currentMedications: {
      type: [String],
      default: [],
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast search
PatientSchema.index({ fullName: 'text', email: 'text', phoneNumber: 'text' });

export const Patient: Model<IPatientDocument> =
  mongoose.models.Patient || mongoose.model<IPatientDocument>('Patient', PatientSchema);

export default Patient;
