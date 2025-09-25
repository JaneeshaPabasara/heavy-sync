import mongoose, {Schema} from 'mongoose';
import {z} from "zod";

// Supplier Schema
const supplierSchema = new Schema({
    name: {type: String, required: true},
    contactEmail: {type: String},
    contactPhone: {type: String},
    address: {type: String}
}, {timestamps: true});

export const SupplierModel = mongoose.model('Supplier', supplierSchema);

// Category Schema
const categorySchema = new Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String}
}, {timestamps: true});

export const CategoryModel = mongoose.model('Category', categorySchema);

// Part Schema
const partSchema = new Schema({
    name: {type: String, required: true},
    partNumber: {type: String, required: true, unique: true},
    description: {type: String},
    categoryId: {type: Schema.Types.ObjectId, ref: 'Category'},
    supplierId: {type: Schema.Types.ObjectId, ref: 'Supplier'},
    quantity: {type: Number, required: true, default: 0},
    minimumStock: {type: Number, required: true, default: 0},
    unitPrice: {type: Number, required: true, default: 0},
    location: {type: String}
}, {timestamps: true});

export const PartModel = mongoose.model('Part', partSchema);

// Movement Schema
const movementSchema = new Schema({
    partId: {type: Schema.Types.ObjectId, ref: 'Part', required: true},
    type: {type: String, enum: ['in', 'out'], required: true},
    quantity: {type: Number, required: true},
    reason: {type: String}
}, {timestamps: true});

export const MovementModel = mongoose.model('Movement', movementSchema);

// Report Schema
const reportSchema = new Schema({
    name: {type: String, required: true},
    type: {type: String, enum: ['inventory', 'low-stock', 'movements', 'supplier-analysis'], required: true},
    dateRange: {type: String, required: true}
}, {timestamps: true});

export const ReportModel = mongoose.model('Report', reportSchema);

// Validation schemas using Zod
export const insertSupplierSchema = z.object({
    name: z.string(),
    contactEmail: z.string().email().optional(),
    contactPhone: z.string().optional(),
    address: z.string().optional()
});

export const insertCategorySchema = z.object({
    name: z.string(),
    description: z.string().optional()
});

export const insertPartSchema = z.object({
    name: z.string(),
    partNumber: z.string(),
    description: z.string().optional(),
    categoryId: z.string().optional(),
    supplierId: z.string().optional(),
    quantity: z.number().default(0),
    minimumStock: z.number().default(0),
    unitPrice: z.number().default(0),
    location: z.string().optional()
});

export const insertMovementSchema = z.object({
    partId: z.string(),
    type: z.enum(['in', 'out']),
    quantity: z.number(),
    reason: z.string().optional()
});

export const insertReportSchema = z.object({
    name: z.string(),
    type: z.enum(['inventory', 'low-stock', 'movements', 'supplier-analysis']),
    dateRange: z.string()
});