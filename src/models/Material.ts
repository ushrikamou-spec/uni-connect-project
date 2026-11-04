import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const materialSchema = new Schema(
    {
        title: { type: String, required: true, trim: true, maxlength: 120 },
        course: { type: String, required: true, trim: true, uppercase: true, maxlength: 20 },
        description: { type: String, trim: true, maxlength: 500, default: "" },
        fileName: { type: String, required: true },
        contentType: { type: String, default: "application/octet-stream" },
        size: { type: Number, required: true },
        fileId: { type: Schema.Types.ObjectId, required: true }, // the GridFS file
        uploader: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        downloads: { type: Number, default: 0 },
    },
    { timestamps: true }
);

materialSchema.index({ course: 1, createdAt: -1 });

export type MaterialDoc = InferSchemaType<typeof materialSchema>;

const Material: Model<MaterialDoc> =
    (mongoose.models.Material as Model<MaterialDoc>) ||
    mongoose.model<MaterialDoc>("Material", materialSchema);

export default Material;