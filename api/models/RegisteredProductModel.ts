import mongoose from "mongoose"
import { IRegisteredProduct } from "../interfaces/RegisteredProductInterface"


const RegisteredProductSchema = new mongoose.Schema<IRegisteredProduct, mongoose.Model<IRegisteredProduct, {}, {}>, {}>({
    sl_no: {
        type: Number,
        required: true
    },
    machine:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Machine',
        required: true
    },
    customer:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    }
    ,
    warrantyUpto: Date,
    installationDate: Date,
    amcUpto: Date,
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

export const RegisteredProduct = mongoose.model<IRegisteredProduct, mongoose.Model<IRegisteredProduct, {}, {}>>("RegisteredProduct", RegisteredProductSchema)




