import mongoose, { Document, Schema } from 'mongoose';

export interface ICaregiver extends Document {
    patientId: mongoose.Types.ObjectId;
    caregiverId?: mongoose.Types.ObjectId; // Optional if invited by email but not yet registered
    caregiverEmail: string;
    name?: string; // Caregiver name
    relationship: string;
    permissions: {
        canViewVitals: boolean;
        canViewMedications: boolean;
        canViewAppointments: boolean;
        canReceiveSOS: boolean;
    };
    status: 'pending' | 'active' | 'rejected';
    createdAt: Date;
}

const caregiverSchema = new Schema<ICaregiver>({
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    caregiverId: { type: Schema.Types.ObjectId, ref: 'User' },
    caregiverEmail: { type: String, required: true },
    name: { type: String },
    relationship: { type: String, required: true },
    permissions: {
        canViewVitals: { type: Boolean, default: true },
        canViewMedications: { type: Boolean, default: true },
        canViewAppointments: { type: Boolean, default: true },
        canReceiveSOS: { type: Boolean, default: true },
    },
    status: { type: String, enum: ['pending', 'active', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

// Index to prevent duplicate invites
caregiverSchema.index({ patientId: 1, caregiverEmail: 1 }, { unique: true });

export const Caregiver = mongoose.model<ICaregiver>('Caregiver', caregiverSchema);
