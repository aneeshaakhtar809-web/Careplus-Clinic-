import mongoose, { Schema, Document, Model } from 'mongoose';
import { AppointmentStatus, AppointmentType, PaymentStatus } from '@/types';

export interface IAppointmentDocument extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  patientName: string;
  doctorName: string;
  department: string;
  appointmentDate: string; // "YYYY-MM-DD"
  timeSlot: string;       // "09:30 AM"
  status: AppointmentStatus;
  type: AppointmentType;
  reason: string;
  symptoms?: string;
  consultationNotes?: string;
  prescription?: string;
  fee: number;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointmentDocument>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient ID is required'],
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor ID is required'],
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    doctorName: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    appointmentDate: {
      type: String, // "YYYY-MM-DD" format for precise calendar filtering
      required: [true, 'Appointment date is required'],
      index: true,
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
    type: {
      type: String,
      enum: ['In-Person', 'Video Consultation', 'Follow-up'],
      default: 'In-Person',
    },
    reason: {
      type: String,
      required: [true, 'Reason for visit is required'],
      trim: true,
    },
    symptoms: {
      type: String,
      trim: true,
      default: '',
    },
    consultationNotes: {
      type: String,
      default: '',
    },
    prescription: {
      type: String,
      default: '',
    },
    fee: {
      type: Number,
      required: true,
      default: 50,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

AppointmentSchema.index({ doctorId: 1, appointmentDate: 1, timeSlot: 1 });
AppointmentSchema.index({ patientId: 1, appointmentDate: 1 });
AppointmentSchema.index({ status: 1, appointmentDate: 1 });

export const Appointment: Model<IAppointmentDocument> =
  mongoose.models.Appointment || mongoose.model<IAppointmentDocument>('Appointment', AppointmentSchema);

export default Appointment;
