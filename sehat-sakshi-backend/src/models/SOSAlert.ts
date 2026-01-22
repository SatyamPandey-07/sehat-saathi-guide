import mongoose, { Document, Schema } from 'mongoose';

export interface ISOSAlert extends Document {
    patientId: mongoose.Types.ObjectId;
    location: {
        latitude: number;
        longitude: number;
        address?: string;
    };
    triggerTime: Date;
    status: 'active' | 'resolved' | 'false_alarm';
    notifiedContacts: string[]; // List of emails or phone numbers notified
    resolvedAt?: Date;
}

const sosAlertSchema = new Schema<ISOSAlert>({
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        address: { type: String },
    },
    triggerTime: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'resolved', 'false_alarm'], default: 'active' },
    notifiedContacts: [{ type: String }],
    resolvedAt: { type: Date },
});

export const SOSAlert = mongoose.model<ISOSAlert>('SOSAlert', sosAlertSchema);
