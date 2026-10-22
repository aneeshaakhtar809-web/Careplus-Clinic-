import mongoose, { Schema, Document, Model } from 'mongoose';

export type SubscriptionPlan = 'basic' | 'pro' | 'enterprise';
export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'none';

export interface ISubscriptionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscriptionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true, // One subscription record per user
    },
    plan: {
      type: String,
      enum: {
        values: ['basic', 'pro', 'enterprise'],
        message: '{VALUE} is not a supported plan',
      },
      default: 'basic',
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'trialing', 'past_due', 'canceled', 'incomplete', 'none'],
        message: '{VALUE} is not a supported subscription status',
      },
      default: 'active',
      required: true,
    },
    stripeCustomerId: {
      type: String,
      trim: true,
    },
    stripeSubscriptionId: {
      type: String,
      trim: true,
    },
    stripePriceId: {
      type: String,
      trim: true,
    },
    currentPeriodStart: {
      type: Date,
    },
    currentPeriodEnd: {
      type: Date,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation during hot-reloads
export const Subscription: Model<ISubscriptionDocument> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscriptionDocument>('Subscription', SubscriptionSchema);

export default Subscription;
