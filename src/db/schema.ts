import { varchar, pgEnum, pgTable, primaryKey, serial, uniqueIndex, timestamp, integer, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';


export const partTypeEnum = pgEnum('partType', ['Original', 'Stock', 'Copy'])
export const countingUnitEnum = pgEnum('countingUnit', ['Number', 'Pair', 'Set'])
export const supplierTypeEnum = pgEnum('supplierType', ['Manufacturer', 'Importer', 'Distributor', 'Official Representative'])
export const statusEnum = pgEnum('status', ['Active', 'Inactive'])
export const roleEnume = pgEnum('user_role', ['Super Admin', 'Super', 'User'])
export const orderStatusEnum = pgEnum('order_status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled']);
export const paymentMethodEnum = pgEnum('payment_method', ['cod', 'card_transfer']);
export const paymentStatusEnum = pgEnum('payment_status', ['unpaid', 'paid', 'refunded']);
export const reviewStatusEnum = pgEnum('review_status', ['pending', 'approved', 'rejected']);





// export const partType = pgTable(
//     'part_type', {
//     Types: partTypeEnum('Types').notNull()
// }
// )


export const manufacturerBrand = pgTable('manufacturer_brand', {
    countryOfManufacture: varchar('countryOfManufacture', { length: 20 }).notNull(),
    manufacturingCompany: varchar('manufacturingCompany', { length: 10 }).notNull()
}, (table) => [
    primaryKey({ columns: [table.countryOfManufacture, table.manufacturingCompany] }),
]);



export const suppliers = pgTable('suppliers',
    {
        id: serial('id').primaryKey(),
        supplierName: varchar('supplier_name', { length: 40 }).notNull(),
        ContactPersonName: varchar('contact_person_name', { length: 20 }).notNull(),
        nationalCode: integer('national_code').notNull(),
        phoneNumber: integer('phone_nubmer').notNull(),
        BankAccountNumber: integer('Bank_account_number').notNull(),
        score: integer('score').notNull(),
        status: statusEnum('status_user').default('Active').notNull(),
        cooperationStartDate: timestamp('cooperation_start_date').defaultNow().notNull(),
        description: text('description').notNull()
    },
);

export const cars = pgTable('cars', {
    nameFa: varchar('name_fa', { length: 20 }).notNull(),
    nameEn: varchar('name_En', { length: 20 }).notNull(),
    manufacturingCompany: varchar('manufacturingCompany', { length: 10 }).notNull(),
    countryOfManufacture: varchar('countryOfManufacture', { length: 20 }).notNull(),
    engineCode: integer('engin_code').notNull(),
    vin: integer('VIN').notNull(),
    yearOfManufacture: integer('Year_of_manufacture').notNull()
})