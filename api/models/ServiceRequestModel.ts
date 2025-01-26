import mongoose from "mongoose"
import { IServiceRequest, IProblem, ISolution } from "../interfaces/ServiceRequestInterface"

const ServiceRequestSchema = new mongoose.Schema<IServiceRequest, mongoose.Model<IServiceRequest, {}, {}>, {}>({
    request_id: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    paymentmode: {
        type: String,
        trim: true,
        lowercase: true,
    },
    payable_amount: { type: Number, default: 0 },
    cash_payment: { type: Number, default: 0 },
    upi_payment: { type: Number, default: 0 },
    discount_amount: { type: Number, default: 0 },
    paid_amount: { type: Number, default: 0 },
    happy_code: String,
    paymentDate:Date,
    product:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RegisteredProduct',
        required: true
    }, 
    customer:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },  
    machine:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Machine',
        required: true
    }, 
    closed_on: {
        type: Date,
    },
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
    },
    solution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Solution',
    },
    assigned_engineer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    closed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

const SolutionSchema = new mongoose.Schema<ISolution, mongoose.Model<ISolution, {}, {}>, {}>({
    solution: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    photos: [{
        _id: { type: String },
        filename: { type: String },
        public_url: { type: String },
        content_type: { type: String },
        size: { type: String },
        bucket: { type: String },
        created_at: Date
    }],
    videos: [{
        _id: { type: String },
        filename: { type: String },
        public_url: { type: String },
        content_type: { type: String },
        size: { type: String },
        bucket: { type: String },
        created_at: Date
    }],
    parts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SparePart'
    }],
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

const ProblemSchema = new mongoose.Schema<IProblem, mongoose.Model<IProblem, {}, {}>, {}>({
    problem: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    photos: [{
        _id: { type: String },
        filename: { type: String },
        public_url: { type: String },
        content_type: { type: String },
        size: { type: String },
        bucket: { type: String },
        created_at: Date
    }],
    videos: [{
        _id: { type: String },
        filename: { type: String },
        public_url: { type: String },
        content_type: { type: String },
        size: { type: String },
        bucket: { type: String },
        created_at: Date
    }],
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

export const ServiceRequest = mongoose.model<IServiceRequest, mongoose.Model<IServiceRequest, {}, {}>>("ServiceRequest", ServiceRequestSchema)
export const Solution = mongoose.model<ISolution, mongoose.Model<ISolution, {}, {}>>("Solution", SolutionSchema)
export const Problem = mongoose.model<IProblem, mongoose.Model<IProblem, {}, {}>>("Problem", ProblemSchema)
