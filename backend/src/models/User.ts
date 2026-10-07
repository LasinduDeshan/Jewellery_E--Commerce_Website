import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface ISavedAddress {
  _id?: string;
  label: string; // e.g. "Home", "Office"
  fullName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string; // e.g. "NSW", "VIC", "QLD"
  postalCode: string;
  country: string;
  phoneNumber: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'customer';
  phoneNumber?: string;
  avatar?: string;
  preferredCurrency: 'AUD' | 'USD';
  savedAddresses: ISavedAddress[];
  wishlist: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const SavedAddressSchema = new Schema<ISavedAddress>(
  {
    label: { type: String, default: 'Home' },
    fullName: { type: String, required: true },
    street: { type: String, required: true },
    apartment: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: 'Australia' },
    phoneNumber: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, minlength: 6 },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    phoneNumber: { type: String, trim: true },
    avatar: { type: String },
    preferredCurrency: { type: String, enum: ['AUD', 'USD'], default: 'AUD' },
    savedAddresses: [SavedAddressSchema],
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
