import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClinicSettingsDocument extends Document {
  clinicName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  emergencyPhone: string;
  address: string;
  workingHours: {
    weekdays: string;
    weekends: string;
  };
  defaultSlotDurationMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

const ClinicSettingsSchema = new Schema<IClinicSettingsDocument>(
  {
    clinicName: {
      type: String,
      required: true,
      default: 'CarePulse Medical & Wellness Clinic',
    },
    tagline: {
      type: String,
      default: 'Compassionate, Intelligent Healthcare for Everyone',
    },
    contactEmail: {
      type: String,
      default: 'support@carepulse-clinic.com',
    },
    contactPhone: {
      type: String,
      default: '+1 (555) 234-5678',
    },
    emergencyPhone: {
      type: String,
      default: '+1 (555) 911-HELP',
    },
    address: {
      type: String,
      default: '742 Evergreen Healthcare Blvd, Suite 400, Metro City',
    },
    workingHours: {
      weekdays: {
        type: String,
        default: '08:00 AM - 08:00 PM',
      },
      weekends: {
        type: String,
        default: '09:00 AM - 04:00 PM',
      },
    },
    defaultSlotDurationMinutes: {
      type: Number,
      default: 30,
    },
  },
  {
    timestamps: true,
  }
);

export const ClinicSettings: Model<IClinicSettingsDocument> =
  mongoose.models.ClinicSettings ||
  mongoose.model<IClinicSettingsDocument>('ClinicSettings', ClinicSettingsSchema);

export default ClinicSettings;
