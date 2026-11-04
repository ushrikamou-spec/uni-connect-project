import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { STATUSES } from "../lib/counselling";

const appointmentSchema = new Schema(
    {
        counsellor: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        student: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        date: { type: String, required: true }, // "YYYY-MM-DD"
        start: { type: String, required: true }, // "HH:mm", 24-hour
        end: { type: String, required: true },
        status: { type: String, enum: STATUSES, default: "Pending" },
        // true while the booking holds its slot; false once it is rejected.
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// A slot can only be held by ONE active booking, even if two students click
// at the same moment. Rejected bookings free the slot again.
appointmentSchema.index(
    { counsellor: 1, date: 1, start: 1 },
    { unique: true, partialFilterExpression: { active: true } }
);

export type AppointmentDoc = InferSchemaType<typeof appointmentSchema>;

const Appointment: Model<AppointmentDoc> =
    (mongoose.models.Appointment as Model<AppointmentDoc>) ||
    mongoose.model<AppointmentDoc>("Appointment", appointmentSchema);

export default Appointment;