import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const userSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: { type: String, required: true },
        role: {
            type: String,
            enum: ["student", "faculty", "counsellor"],
            required: true,
        },
        department: { type: String, trim: true },

        // Students
        universityId: { type: String, trim: true },
        cgpa: { type: Number },

        // Counsellors: weekly availability (0 = Sunday ... 6 = Saturday)
        initials: { type: String, trim: true },
        specialty: { type: String, trim: true },
        workDays: { type: [Number], default: undefined },
        officeStart: { type: String }, // "HH:mm", 24-hour
        officeEnd: { type: String },
    },
    { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof userSchema>;

const User: Model<UserDoc> =
    (mongoose.models.User as Model<UserDoc>) ||
    mongoose.model<UserDoc>("User", userSchema);

export default User;