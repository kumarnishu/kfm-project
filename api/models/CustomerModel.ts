import mongoose from "mongoose"
import { ICustomer } from "../interfaces/CustomerInterface"

const CustomerSchema = new mongoose.Schema<ICustomer, mongoose.Model<ICustomer, {}, {}>, {}>({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
    },
    mobile: {
        type: String,
        trim: true,
        required: true,
    },
    address: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
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

export const Customer = mongoose.model<ICustomer, mongoose.Model<ICustomer, {}, {}>>("Customer", CustomerSchema)