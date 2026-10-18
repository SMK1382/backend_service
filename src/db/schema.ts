import { varchar, pgEnum, pgTable, primaryKey, serial, uniqueIndex, timestamp, integer, text, boolean, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';


export const partTypeEnum = pgEnum('partType', ['Original', 'Stock', 'After_Market'])
export const countingUnitEnum = pgEnum('countingUnit', ['Number', 'Pair', 'Set'])
export const supplierTypeEnum = pgEnum('supplierType', ['Manufacturer', 'Importer', 'Distributor', 'Official_Representative'])
export const statusEnum = pgEnum('status', ['Active', 'Inactive'])
export const roleEnum = pgEnum('userRole', ['Super_Admin', 'Super', 'User'])
export const discountTypeEnum = pgEnum('discountType', ['percentage', 'fixed_amount'])
export const orderStatusEnum = pgEnum('orderStatus', ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']);
export const paymentMethodEnum = pgEnum('paymentMethod', ['Cod', 'Card_Transfer']);
export const paymentStatusEnum = pgEnum('paymentStatus', ['Unpaid', 'Paid', 'Refunded']);
export const reviewStatusEnum = pgEnum('reviewStatus', ['Pending', 'Approved', 'Rejected']);



export const carBrands = pgTable('manufacturer_brand', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 10 }).unique().notNull(),
    slug: varchar('slug', { length: 100 }).unique().notNull(),
    country: varchar('country', { length: 10 }).notNull(),
    description: text('description'),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
},
);



export const carModels = pgTable('cars', {
    id: serial('id').primaryKey(),
    nameFa: varchar('name_fa', { length: 20 }).notNull(),
    nameEn: varchar('name_En', { length: 20 }).notNull(),
    brandName: varchar('brand_name', { length: 10 }).references(() => carBrands.id).notNull(),
    engineCode: integer('engin_code').notNull(),
    vin: integer('VIN').notNull(),
    yearOfManufacture: integer('Year_of_manufacture').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('created_at').defaultNow().notNull(),
})

///////////////////////////////////////////////////////////////////
export const categories = pgTable(
    'categories',
    {
        id: serial('id').primaryKey(),
        name: varchar('name', { length: 100 }).unique().notNull(),
        slug: varchar('slug', { length: 120 }).unique().notNull(),
        parentId: integer('parent_id'), // خودارجاع؛ در migrate/relations مدیریت می‌شود
        // iconEmoji: varchar('icon_emoji', { length: 10 }), // مثل 🔧 برای نمایش در کارت
        sortOrder: integer('sort_order').default(0).notNull(),
        isActive: boolean('is_active').default(true).notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('created_at').defaultNow().notNull(),
    },
    (table) => [
        uniqueIndex('categories_slug_unique').on(table.slug),
        index('categories_parent_idx').on(table.parentId),
    ],
);
////////////////////////////////////////////////////////////////////
export const partBrands = pgTable('part_brands', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 20 }).notNull(),
    slug: varchar('slug', { length: 20 }).notNull(),
    countryOfOrigin: varchar('slug', { length: 20 }).notNull(),
    description: text('description'),
    status: statusEnum('status').default('Active').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('created_at').defaultNow().notNull(),
})
////////////////////////////////////////////////////////////////////
export const parts = pgTable(
    'parts',
    {
        id: serial('id').primaryKey(),
        name: varchar('name', { length: 180 }).notNull(),
        slug: varchar('slug', { length: 220 }).notNull(),
        brandId: integer('brnad_id').references(() => partBrands.id, {
            onDelete: 'set null'
        }),
        description: text('description'),
        price: integer('price').notNull(), // قیمت به تومان
        discountAmount: integer('discount_amount').references(() => discounts.id, {
            onDelete: 'set null'
        }), // قیمت با تخفیف (اگر باشد)
        stock: integer('stock').default(0).notNull(), // تعداد موجود در انبار
        partNumber: varchar('part_number', { length: 60 }), // کد فنی قطعه
        weightGrams: integer('weight_grams'), // وزن به گرم
        supplier: varchar('supplier').references(() => suppliers.id).notNull(),
        unit: countingUnitEnum('unit').default('Number').notNull(),
        categoryId: integer('category_id').references(() => categories.id, {
            onDelete: 'set null',
        }),
        // brandId: integer('brand_id').references(() => carBrands.id, {
        //     onDelete: 'set null',
        // }),
        status: statusEnum('status_part').default('Active').notNull(),
        isFeatured: boolean('is_featured').default(false).notNull(), // نمایش در ویژه‌ها
        metaTitle: varchar('meta_title', { length: 200 }), // عنوان سئو
        metaDescription: varchar('meta_description', { length: 400 }), // توضیحات سئو
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('update_at').defaultNow().notNull(),
    },
    (table) => [
        uniqueIndex('parts_slug_unique').on(table.slug),
        index('parts_category_idx').on(table.categoryId),
        index('parts_brand_idx').on(table.brandId),
        index('parts_active_featured_idx').on(table.status, table.isFeatured),
        index('parts_part_number_idx').on(table.partNumber),
    ],
);
///////////////////////////////////////////////
export const discounts = pgTable('discount', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 20 }).notNull(),
    amount: integer('amount').notNull(),
    discountType: discountTypeEnum('discountType').default('percentage').notNull(),
    status: statusEnum(status).default('Active').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('update_at').defaultNow().notNull(),
})
///////////////////////////////////////////////
export const productImages = pgTable(
    'product_images',
    {
        id: serial('id').primaryKey(),
        partId: integer('part_id')
            .references(() => parts.id, { onDelete: 'cascade' })
            .notNull(),
        url: varchar('url', { length: 500 }).notNull(),
        alt: varchar('alt', { length: 200 }),
        sortOrder: integer('sort_order').default(0).notNull(),
    },
    (table) => [index('product_images_part_idx').on(table.partId)],
);
///////////////////////////////////////////////
export const partCompatibility = pgTable(
    'part_compatibility',
    {
        id: serial('id').primaryKey(),
        partId: integer('part_id')
            .references(() => parts.id, { onDelete: 'cascade' })
            .notNull(),
        carModelId: integer('car_model_id')
            .references(() => carModels.id, { onDelete: 'cascade' })
            .notNull(),
        yearsNote: varchar('years_note', { length: 40 }).default('').notNull(), // مثل «2018-2022»
        engineCode: varchar('engine_code', { length: 60 }), // کد موتور اگر مشخص باشد
    },
    (table) => [
        uniqueIndex('part_compat_unique').on(
            table.partId,
            table.carModelId,
            table.yearsNote,
        ),
        index('part_compat_model_idx').on(table.carModelId),
    ],
);

///////////////////////////////////////////////

export const suppliers = pgTable('suppliers',
    {
        id: serial('id').primaryKey(),
        supplierName: varchar('supplier_name', { length: 40 }).notNull(),
        supplierType: supplierTypeEnum('supplier_type').default('Distributor').notNull(),
        ContactPersonName: varchar('contact_person_name', { length: 20 }).notNull(),
        nationalCode: varchar('national_code', { length: 11 }).notNull(),
        phoneNumber: integer('phone_nubmer').notNull(),
        BankAccountNumber: integer('Bank_account_number').notNull(),
        score: integer('score').notNull(),
        status: statusEnum('status_user').default('Active').notNull(),
        cooperationStartDate: timestamp('cooperation_start_date').defaultNow().notNull(),
        description: text('description').notNull()
    },
);

// ------------------------------------------------------------------
// پیام‌های صفحه تماس با ما
// ------------------------------------------------------------------
export const contactMessages = pgTable(
    'contact_messages',
    {
        id: serial('id').primaryKey(),
        name: varchar('name', { length: 120 }).notNull(),
        email: varchar('email', { length: 150 }).notNull(),
        phone: varchar('phone', { length: 11 }),
        subject: varchar('subject', { length: 200 }).notNull(),
        message: text('message').notNull(),
        isRead: boolean('is_read').default(false).notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
    },
    (table) => [index('contact_messages_read_idx').on(table.isRead, table.createdAt)],
);
///////////////////////////////////////////////////////////////
export const banners = pgTable(
    'banners',
    {
        id: serial('id').primaryKey(),
        title: varchar('title', { length: 150 }).notNull(),
        subtitle: varchar('subtitle', { length: 250 }),
        imageUrl: varchar('image_url', { length: 500 }).notNull(),
        linkUrl: varchar('link_url', { length: 500 }).notNull(),
        sortOrder: integer('sort_order').default(0).notNull(),
        isActive: boolean('is_active').default(true).notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('created_at').defaultNow().notNull(),
    },
    (table) => [index('banners_placement_idx').on(table.isActive)],
);


export const users = pgTable('users', {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name", { length: 20 }).notNull(),
    lastName: varchar("last_name", { length: 20 }).notNull(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    phone: varchar('phone', { length: 11 }).unique().notNull(),
    nationalCode: varchar('national_code', { length: 10 }).notNull(),
    status: statusEnum('status').default('Active').notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    role: roleEnum('role').default('User').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('created_at').defaultNow().notNull(),
    deletedAt: timestamp('created_at').defaultNow().notNull(),
},
    (table) => [
        uniqueIndex('users_email_unique').on(table.email),
        uniqueIndex('users_phone_unique').on(table.phone),
    ]
)

export const addresses = pgTable(
    'addresses',
    {
        id: serial('id').primaryKey(),
        userId: integer('user_id')
            .references(() => users.id, { onDelete: 'cascade' })
            .notNull(),
        receiverName: varchar('receiver_name', { length: 120 }).notNull(), // نام گیرنده
        receiverPhone: varchar('receiver_phone', { length: 11 }).notNull(), // موبایل گیرنده
        province: varchar('province', { length: 50 }).notNull(), // استان (یکی از ۳۱ استان ایران)
        city: varchar('city', { length: 60 }).notNull(), // شهر (وابسته به استان)
        postalCode: varchar('postal_code', { length: 10 }).notNull(), // کد پستی دقیقاً ۱۰ رقم
        line: text('line').notNull(), // آدرس محلی کامل
        isDefault: boolean('is_default').default(false).notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('created_at').defaultNow().notNull(),
    },
    (table) => [index('addresses_user_idx').on(table.userId)],
);


//////////////////////////////////////////////////////////////////
export const orders = pgTable(
    'orders',
    {
        id: serial('id').primaryKey(),
        userId: integer('user_id')
            .references(() => users.id)
            .notNull(),
        status: orderStatusEnum('status').default('Pending').notNull(),
        paymentMethod: paymentMethodEnum('payment_method').notNull(),
        paymentStatus: paymentStatusEnum('payment_status')
            .default('Unpaid')
            .notNull(),
        // اسنپ‌شات اطلاعات ارسال
        receiverName: varchar('receiver_name', { length: 120 }).notNull(),
        receiverPhone: varchar('receiver_phone', { length: 11 }).notNull(),
        province: varchar('province', { length: 50 }).notNull(),
        city: varchar('city', { length: 60 }).notNull(),
        postalCode: varchar('postal_code', { length: 10 }).notNull(),
        addressLine: text('address_line').notNull(),
        note: text('note'), // توضیحات سفارش (اختیاری)
        // مبالغ (همه به تومان)
        itemsSubtotal: integer('items_subtotal').default(0).notNull(),
        discountAmount: integer('discount_amount').default(0).notNull(),
        shippingCost: integer('shipping_cost').default(0).notNull(),
        totalAmount: integer('total_amount').default(0).notNull(),
        // couponCode: varchar('coupon_code', { length: 40 }),
        trackingCode: varchar('tracking_code', { length: 60 }), // کد رهگیری پست
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at').defaultNow().notNull(),
    },
    (table) => [
        index('orders_user_idx').on(table.userId),
        index('orders_status_created_idx').on(table.status, table.createdAt),
    ],
);
//////////////////////////////////////////////////////////////////
export const orderItems = pgTable(
    'order_items',
    {
        id: serial('id').primaryKey(),
        orderId: integer('order_id')
            .references(() => orders.id, { onDelete: 'cascade' })
            .notNull(),
        partId: integer('part_id')
            .references(() => parts.id)
            .notNull(),
        partName: varchar('part_name', { length: 180 }).notNull(), // اسنپ‌شات
        partNumber: varchar('part_number', { length: 60 }), // اسنپ‌شات
        imageUrl: varchar('image_url', { length: 500 }), // اسنپ‌شات
        unitPrice: integer('unit_price').notNull(), // قیمت واحد در لحظه ثبت سفارش
    },
    (table) => [index('order_items_order_idx').on(table.orderId)],
);
///////////////////////////////////////////////////////////////////
export const reviews = pgTable(
    'reviews',
    {
        id: serial('id').primaryKey(),
        partId: integer('part_id')
            .references(() => parts.id, { onDelete: 'cascade' })
            .notNull(),
        userId: integer('user_id')
            .references(() => users.id, { onDelete: 'cascade' })
            .notNull(),
        rating: integer('rating').notNull(), // ۱ تا ۵
        comment: text('comment').notNull(),
        status: reviewStatusEnum('status').default('Pending').notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
    },
    (table) => [
        uniqueIndex('reviews_part_user_unique').on(table.partId, table.userId),
        index('reviews_part_status_idx').on(table.partId, table.status),
    ],
);
///////////////////////////////////////////////////////////////////
export const returnRequest = pgTable('return_request', {
    id: serial('id').primaryKey(),
    orderId: integer('order_id').references(() => orders.id).notNull(),
    userId: integer('user_id').references(() => users.id).notNull(),
    reasonDescription: text('reason_description'),
    status: statusEnum('status').default('Active').notNull(),
    requestedAt: timestamp('requested_at').defaultNow().notNull(),
})
///////////////////////////////////////////////////////////////////
export const wishlist = pgTable(
    'wishlist',
    {
        id: serial('id').primaryKey(),
        userId: integer('user_id')
            .references(() => users.id, { onDelete: 'cascade' })
            .notNull(),
        partId: integer('part_id')
            .references(() => parts.id, { onDelete: 'cascade' })
            .notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
    },
    (table) => [uniqueIndex('wishlist_user_part_unique').on(table.userId, table.partId)],
);
//////////////////////////////////////////////////////////////////
export const shoppingCart = pgTable(
    'shopping_cart', {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    partId: integer('part_id')
        .references(() => parts.id, { onDelete: 'cascade' })
        .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
},
    (table) => [uniqueIndex('wishlist_user_part_unique').on(table.userId, table.partId)],
)