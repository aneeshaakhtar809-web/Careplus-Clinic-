import mongoose, { Schema, Document, Model } from 'mongoose';
import { IPrescriptionItem, ILabTestItem, IVitalSigns } from '@/types';

export interface IMedicalRecordDocument extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  appointmentId?: mongoose.Types.ObjectId;
  patientName: string;
  doctorName: string;
  diagnosis: string;
  treatmentPlan: string;
  prescriptions: IPrescriptionItem[];
  labTests: ILabTestItem[];
  vitalSigns?: IVitalSigns;
  notes?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PrescriptionItemSchema = new Schema(
  {
    medication: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    instructions: { type: String, default: '' },
  },
  { _id: false }
);

const LabTestItemSchema = new Schema(
  {
    testName: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Normal', 'Abnormal'],
      default: 'Pending',
    },
    notes: { type: String, default: '' },
  },
  { _id: false }
);

const VitalSignsSchema = new Schema(
  {
    bloodPressure: { type: String, default: '' }, // e.g. "120/80 mmHg"
    heartRate: { type: String, default: '' },     // e.g. "72 bpm"
    temperature: { type: String, default: '' },   // e.g. "98.6 °F"
    weight: { type: String, default: '' },        // e.g. "70 kg"
    respiratoryRate: { type: String, default: '' },
    oxygenSaturation: { type: String, default: '' },
  },
  { _id: false }
);

const MedicalRecordSchema = new Schema<IMedicalRecordDocument>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient ID is required'],
      index: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor ID is required'],
      index: true,
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: false,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    doctorName: {
      type: String,
      required: true,
      trim: true,
    },
    diagnosis: {
      type: String,
      required: [true, 'Diagnosis is required'],
      trim: true,
    },
    treatmentPlan: {
      type: String,
      required: [true, 'Treatment plan is required'],
      trim: true,
    },
    prescriptions: {
      type: [PrescriptionItemSchema],
      default: [],
    },
    labTests: {
      type: [LabTestItemSchema],
      default: [],
    },
    vitalSigns: {
      type: VitalSignsSchema,
      default: () => ({}),
    },
    notes: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const MedicalRecord: Model<IMedicalRecordDocument> =
  mongoose.models.MedicalRecord ||
  mongoose.model<IMedicalRecordDocument>('MedicalRecord', MedicalRecordSchema);

export default MedicalRecord;
