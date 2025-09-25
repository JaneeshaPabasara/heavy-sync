import {sql} from "drizzle-orm";
import {pgTable, text, varchar, integer, decimal, timestamp} from "drizzle-orm/pg-core";
import {createInsertSchema} from "drizzle-zod";

export const suppliers = pgTable("suppliers", {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid
        ()`),
    name: text("name").notNull(),
    contactEmail: text("contact_email"),
    contactPhone: text("contact_phone"),
    address: text("address"),
});

export const categories = pgTable("categories", {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid
        ()`),
    name: text("name").notNull().unique(),
    description: text("description"),
});

export const parts = pgTable("parts", {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid
        ()`),
    name: text("name").notNull(),
    partNumber: text("part_number").notNull().unique(),
    description: text("description"),
    categoryId: varchar("category_id").references(() => categories.id),
    supplierId: varchar("supplier_id").references(() => suppliers.id),
    quantity: integer("quantity").notNull().default(0),
    minimumStock: integer("minimum_stock").notNull().default(0),
    unitPrice: decimal("unit_price", {precision: 10, scale: 2}).notNull().default("0.00"),
    location: text("location"),
    createdAt: timestamp("created_at").default(sql`now
        ()`),
    updatedAt: timestamp("updated_at").default(sql`now
        ()`),
});

export const movements = pgTable("movements", {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid
        ()`),
    partId: varchar("part_id").notNull().references(() => parts.id),
    type: text("type").notNull(), // 'in' | 'out'
    quantity: integer("quantity").notNull(),
    reason: text("reason"),
    createdAt: timestamp("created_at").default(sql`now
        ()`),
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
    id: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
    id: true,
});

export const insertPartSchema = createInsertSchema(parts).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export const insertMovementSchema = createInsertSchema(movements).omit({
    id: true,
    createdAt: true,
});
// Reports schema for tracking generated reports
export const reports = pgTable('reports', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    type: text('type').notNull(), // 'inventory', 'low-stock', 'movements', 'supplier-analysis'
    dateRange: text('date_range').notNull(), // JSON string with from/to dates
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const insertReportSchema = createInsertSchema(reports).omit({id: true, createdAt: true});