import mongoose from "mongoose"
import { IMachine } from "../interfaces/MachineInterface"

const MachineSchema = new mongoose.Schema<IMachine, mongoose.Model<IMachine, {}, {}>, {}>({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    model: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    
    service_charge: {
        type: Number, default: 0
    },
    photo: {
        _id: { type: String },
        filename: { type: String },
        public_url: { type: String },
        content_type: { type: String },
        size: { type: String },
        bucket: { type: String },
        created_at: Date
    },
    created_at: {
        type: Date,
        default: new Date(),
        required: true,

    },

    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updated_at: {
        type: Date,
        default: new Date(),
        required: true,

    },

    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

export const Machine = mongoose.model<IMachine, mongoose.Model<IMachine, {}, {}>>("Machine", MachineSchema)