import {
    pgTable,
    uniqueIndex,
    bigint,
    varchar,
    text,
    timestamp,
    smallint,
    integer,
    uuid,
    serial,
    foreignKey,
    boolean,
    jsonb,
    date,
    type AnyPgColumn,
    primaryKey,
    pgEnum,
    index,
} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
// import { Slugify } from '../../utils'
// enum UserRole {
//     ADMIN,
//     USER
// }
// export const UserRole = pgEnum('role', ['admin', 'user', 'author']);

// allowed to be seeded:
// categories
// billboards
// collections
// media
// products
// orders
// menus
// pages

export const accountTypeEnum = ["email", "google", "github"] as const;
export const accounts = pgTable("accounts", {
    id: serial("id").notNull().primaryKey(),
    userId: uuid("user_uuid")
      .references(() => users.uuid, { onDelete: "cascade" })
      .unique()
      .notNull(),
    accountType: text("account_type", { enum: accountTypeEnum }).notNull(),
    oauthId: text("oauth_id").unique(),
  },
  (table) => ({
      UserAccountIndex: uniqueIndex('useraccount_idx').on(table.userId, table.accountType),
  })
)
export const users = pgTable(
    'user',
    {
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        id: serial('id').notNull(),
        uuid: uuid('uuid')
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        organisationUuid: uuid('organisation_uuid').references(
            () => organisation.uuid
        ),
        firstname: varchar('firstname', { length: 100 }),
        lastname: varchar('lastname', { length: 100 }),
        username: varchar('username', { length: 50 }).notNull(),
        email: text('email').notNull(),
        emailVerified: timestamp('emailVerified', { mode: 'date' }),
        image: text('image'),
        profileImageId: uuid('profile_image_id').references(
            (): AnyPgColumn => media.uuid,
            { onDelete: 'set null' }
        ),
        hashedPassword: varchar('hashed_password', { length: 255 }),
        isTwoFactorEnabled: boolean('is_two_factor_enabled').default(false),
        status: varchar('status', { length: 50 }).notNull().default('active'),
        isDeleted: boolean('is_deleted').default(false).notNull(),
        // role: uuid('uuid').references(() => roles.uuid, { onDelete: "cascade" }),
        data: jsonb('data'),
        rememberToken: varchar('remember_token', { length: 100 }),
        lastLoggedin: timestamp('last_loggedin', { mode: 'date' }),
        createdAt: timestamp('created_at', { mode: 'date' })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
    },
    (table) => ({
        emailIndex: uniqueIndex('email_idx').on(table.email),
        organisationIndex: index('fk_users_organisation_idx').on(
            table.organisationUuid
        ),
    })
)

export const authUser = createSelectSchema(users).pick({
    id: true,
    username: true,
    email: true,
})
export const userValidator = createInsertSchema(users).omit({
    id: true,
    uuid: true,
    createdAt: true,
    updatedAt: true,
})

export const organisation = pgTable('organisation', {
    id: serial('id').notNull(),
    uuid: uuid('uuid')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    domain: varchar('domain', { length: 255 }).notNull().unique(),
    databaseStrategy: varchar('database_strategy', { length: 255 })
        .default(sql`'shared'::character varying`)
        .notNull(),
    email: text('email'),
    replyEmail: text('reply_email'),
    timezone: varchar('timezone', { length: 255 })
        .default(sql`'UTC'::character varying`)
        .notNull(),
    logo: uuid('logo').references((): AnyPgColumn => media.uuid, {
        onDelete: 'set null',
    }),
    logoReverse: uuid('logo_reverse').references(
        (): AnyPgColumn => media.uuid,
        {
            onDelete: 'set null',
        }
    ),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }),
})


export const category = pgTable(
    'category',
    {
        id: serial('id').notNull(),
        uuid: uuid('uuid')
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        courseId: uuid('course_id').references(()=> course.uuid),
        name: text('name').notNull(),
        slug: varchar('slug', { length: 256 }).notNull(),
        description: text('description'),
        isSeeded: boolean('is_seeded').default(false).notNull(),
        createdAt: timestamp('created_at', { mode: 'date' })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
    },
    (table) => ({
        courseUuid: index('fk_course_category_idx').on(table.courseId),
        slugIndex: uniqueIndex('category_slug_idx').on(
            table.slug,
        ),
    })
)

export const submission = pgTable(
    'submission',
    {
        id: serial('id').notNull(),
        uuid: uuid('uuid')
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        userUuid: uuid('user_uuid')
            .notNull()
            .references(() => users.uuid),
        
        problemUuid: uuid('problem_uuid')
            .notNull()
            .references(() => problem.uuid),
        solution: text('solution'),
        note: text('note'),
        grade: integer('grade').notNull(),
        submittedAt: timestamp('submitted_at', { mode: 'date' }),
        nextReviewAt: timestamp('next_review_at', { mode: 'date'}),
        createdAt: timestamp('created_at', { mode: 'date' })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
    },
    (table) => ({
        userIndex: index('fk_user_schedule_idx').on(table.userUuid),
        problemIndex: index('fk_problem_schedule_idx').on(table.problemUuid),
        submittedAt: index('fk_submitted_schedule_idx').on(table.submittedAt),

    })
)

export const course = pgTable(
    'course',
    {
        id: serial('id').notNull(),
        uuid: uuid('uuid')
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        organisationUuid: uuid('organisation_uuid')
            .notNull()
            .references(() => organisation.uuid, { onDelete: 'cascade' }),
        userId: uuid('user_id').references(() => users.uuid, { onDelete: 'cascade' }),
        name: text('name').notNull(),
        slug: text('slug').notNull(),
        description: text('description'),
        status: varchar('status', { length: 50 }).notNull().default('draft'),
        isDeleted: boolean('is_deleted').default(false),
        imageUuid: uuid('image_uuid').references(() => media.uuid),
        isSeeded: boolean('is_seeded').default(false).notNull(),
        createdAt: timestamp('created_at', { mode: 'date' })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
    },
    (table) => ({
        slugIndex: uniqueIndex('course_slug_idx').on(
            table.slug,
            table.userId
        ),
        organisationUuid: index('fk_course_organisation_idx').on(table.organisationUuid),
        userId: index('fk_course_user_idx').on(table.userId),
        imageIndex: index('fk_course_image_idx').on(table.imageUuid),
    })
)


export const topic = pgTable(
    'topic',
    {
        id: serial('id').notNull(),
        uuid: uuid('uuid')
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        
        courseId: uuid('course_id').notNull().references(()=> course.uuid),
        name: text('name').notNull(),
        slug: text('slug').notNull(),
        description: text('description'),
        status: varchar('status', { length: 50 }).notNull().default('draft'),
        isDeleted: boolean('is_deleted').default(false),
        imageUuid: uuid('image_uuid').references(() => media.uuid),
        isSeeded: boolean('is_seeded').default(false).notNull(),
        createdAt: timestamp('created_at', { mode: 'date' })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
    },
    (table) => ({
        courseUuid: index('fk_course_topic_idx').on(table.courseId),
        slugIndex: uniqueIndex('topic_slug_idx').on(
            table.slug,
        ),
        imageIndex: index('fk_topic_image_idx').on(table.imageUuid),
    })
)


export const problem = pgTable(
    'problem',
    {
        id: serial('id').notNull(),
        uuid: uuid('uuid')
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        categoryUuid: uuid('category_uuid')
            .references(() => category.uuid),
        courseId: uuid('course_id').notNull().references(()=> course.uuid),
        topicId: uuid('topic_id').references(()=> topic.uuid),
        name: text('name').notNull(),
        slug: text('slug').notNull(),
        description: text('description'),
        starterCode: text('starter_code'),
        answerCode: text('answer_code'),
        difficulty: integer('difficulty').notNull(),
        // tags: text('tags'),
        link: text('link'),
        status: varchar('status', { length: 50 }).notNull().default('draft'),
        isDeleted: boolean('is_deleted').default(false),
        imageUuid: uuid('image_uuid').references(() => media.uuid),
        isSeeded: boolean('is_seeded').default(false).notNull(),
        createdAt: timestamp('created_at', { mode: 'date' })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
    },
    (table) => ({
        slugIndex: uniqueIndex('product_slug_idx').on(
            table.slug,
        ),
        categoryIndex: index('fk_problem_category_idx').on(table.categoryUuid),
        topicIndex: index('fk_problem_topic_idx').on(table.topicId),
        imageIndex: index('fk_problem_image_idx').on(table.imageUuid),
        // tagsIndex: index('tags_search_index').using('gin', table.tags)
    })
)

export const userProblem = pgTable(
    'user_problem',
    {
        uuid: uuid('uuid')
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        organisationUuid: uuid('organisation_uuid')
            .notNull()
            .references(() => organisation.uuid, { onDelete: 'cascade' }),
        userUuid: uuid('user_uuid')
            .notNull()
            .references(() => users.uuid),
        problemUuid: uuid('problem_uuid')
            .notNull()
            .references(() => problem.uuid, { onDelete: 'cascade' }),
        grade: integer('grade'),
        note: text('note'),
        solution: text('solution'),
        nextReviewAt: timestamp('next_review_at', { mode: 'date'}),
        createdAt: timestamp('created_at', { mode: 'date' })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' })
            .notNull()
            .defaultNow(),

    },
    (table) => ({
        organisationIndex: index('fk_problemcollection_organisation_idx').on(
            table.organisationUuid
        ),
        userIndex: index('fk_user_problem_idx').on(table.userUuid),
        problemIndex: index('fk_problem_idx').on(table.problemUuid),
    })
)


export const collection = pgTable(
    'collection',
    {
        id: serial('id').notNull(),
        uuid: uuid('uuid')
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        organisationUuid: uuid('organisation_uuid')
            .notNull()
            .references(() => organisation.uuid, { onDelete: 'cascade' }),
        name: text('name').notNull(),
        slug: text('slug').notNull(),
        description: text('description'),
        status: boolean('status').default(true).notNull(),
        isSeeded: boolean('is_seeded').default(false).notNull(),
        createdAt: timestamp('created_at', { mode: 'date' })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
    },
    (table) => ({
        slugIndex: uniqueIndex('collection_slug_idx').on(
            table.slug,
        ),
        organisationIndex: index('fk_collection_organisation_idx').on(
            table.organisationUuid
        ),
    })
)

export const problemCollection = pgTable(
    'problem_collection',
    {
        uuid: uuid('uuid')
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        organisationUuid: uuid('organisation_uuid')
            .notNull()
            .references(() => organisation.uuid, { onDelete: 'cascade' }),
        collectionUuid: uuid('collection_uuid')
            .notNull()
            .references(() => collection.uuid, { onDelete: 'cascade' }),
        problemUuid: uuid('problem_uuid')
            .notNull()
            .references(() => problem.uuid, { onDelete: 'cascade' }),
        order: integer('order').notNull(),
        status: boolean('status').default(true).notNull(),
        createdAt: timestamp('created_at', { mode: 'date' })
            .notNull()
            .defaultNow(),
    },
    (table) => ({
        organisationIndex: index('fk_problem_collection_organisation_idx').on(
            table.organisationUuid
        ),
        collectionIndex: index('fk_problem_collection_collection_idx').on(
            table.collectionUuid
        ),
        problemIndex: index('fk_problemc_ollection_problem_idx').on(table.problemUuid),
    })
)


export const media = pgTable(
    'media',
    {
        id: serial('id').notNull(),
        uuid: uuid('uuid')
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        organisationUuid: uuid('organisation_uuid')
            .notNull()
            .references(() => organisation.uuid),
        title: varchar('title', { length: 255 }),
        caption: text('caption'),
        altText: text('alt_text'),
        copyright: text('copyright'),
        source: text('source'),
        private: boolean('private').notNull().default(false),
        description: text('description'),
        filename: varchar('filename', { length: 255 }).notNull(),
        filesize: integer('filesize').notNull(),
        filetype: varchar('filetype', { length: 255 }).notNull(),
        tags: varchar('tags', { length: 255 }),
        width: integer('width').notNull(),
        height: integer('height').notNull(),
        storageUrl: varchar('storage_url', { length: 255 }).notNull(),
        cdnUrl: varchar('cdn_url', { length: 255 }).notNull(),
        type: varchar('type', { length: 255 }).notNull(),
        isSeeded: boolean('is_seeded').default(false).notNull(),
        // userUuid: uuid('user_uuid')
        //     .notNull()
        //     .references(() => users.uuid),
        createdAt: timestamp('created_at', { mode: 'date' })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
    },
    (table) => ({
        organisationIndex: index('fk_media_organisation_idx').on(
            table.organisationUuid
        ),
    })
)


export const assetLog = pgTable(
    'asset_log',
    {
        uuid: uuid('uuid')
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        organisationUuid: uuid('organisation_uuid')
            .notNull()
            .references(() => organisation.uuid),
        mediaUuid: uuid('media_uuid').references(() => media.uuid),
        resource: text('resource').notNull(),
        resourceAttribute: text('resource_attribute'),
        resourceUuid: uuid('resource_uuid').notNull(),
        createdAt: timestamp('created_at', { mode: 'date' })
            .notNull()
            .defaultNow(),
    },
    (table) => ({
        organisationIndex: index('fk_asset_log_organisation_idx').on(
            table.organisationUuid
        ),
        createdAtIndex: index('fk_asset_log_created_at_idx').on(
            table.createdAt
        ),
        mediaIndex: index('fk_asset_log_media_idx').on(table.mediaUuid),
    })
)


export const countries = pgTable('countries', {
    id: serial('id').primaryKey().notNull(),
    code: varchar('code', { length: 3 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    currencyCode: varchar('currency_code', { length: 3 }).notNull(),
    isoNumeric: varchar('iso_numeric', { length: 3 }).notNull(),
    isoAlpha3: varchar('iso_alpha3', { length: 3 }).notNull(),
    isTaxApplicable: boolean('is_tax_applicable').default(false).notNull(),
    taxPercent: integer('tax_percent').default(0).notNull(),
    taxTitle: text('tax_title'),
})

export const plans = pgTable('plans', {
    id: serial('id').notNull(),
    uuid: uuid('uuid')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    price: integer('price').notNull(),
    currencyCode: varchar('currency_code', { length: 3 }).notNull(),
    plan_interval: varchar('plan_interval', { length: 10 })
        .notNull()
        .default('month'),
    trial_period_days: integer('trial_period_days').default(0).notNull(),
    status: boolean('status').default(true).notNull(),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }),
})

export const planSettings = pgTable('plan_settings', {
    id: serial('id').notNull(),
    uuid: uuid('uuid')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    plandUuid: uuid('plan_uuid')
        .notNull()
        .references(() => plans.uuid, { onDelete: 'cascade' }),
    userCount: integer('userCount').default(5),
    storeCount: integer('storeCount').default(1).notNull(),
    productCount: integer('productCount').default(20),
    assetCount: integer('assetCount').default(100),
    updatedAt: timestamp('updated_at', { mode: 'date' }),
})





export const emailTypeEnum = pgEnum('email_type', ['html', 'markdown', 'text'])
export const layoutTypeEnum = pgEnum('email_layout_type', ['layout', 'content'])

export const emailTemplate = pgTable(
    'email_template',
    {
        id: serial('id').notNull(),
        uuid: uuid('uuid')
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        organisationUuid: uuid('organisation_uuid')
            .notNull()
            .references(() => organisation.uuid, { onDelete: 'cascade' }),
        emailId: uuid('email_id').references(() => emails.uuid, {
            onDelete: 'cascade',
        }),
        layoutId: uuid('layout_id').references(
            (): AnyPgColumn => emailTemplate.uuid,
            {
                onDelete: 'set null',
            }
        ),
        name: text('name').notNull(),
        slug: text('slug').notNull(),
        subject: text('subject'),
        content: text('content'),
        contentType: emailTypeEnum('content_type').notNull().default('html'),
        type: layoutTypeEnum('type').notNull().default('content'),
        status: boolean('status').default(true).notNull(),
        isSeeded: boolean('is_seeded').default(false).notNull(),
        createdAt: timestamp('created_at', { mode: 'date' })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
    },
    (table) => ({
        slugIndex: uniqueIndex('email_slug_idx').on(
            table.slug,
        ),
        organisationIndex: index('fk_email_organisation_idx').on(
            table.organisationUuid
        ),

    })
)

export const emails = pgTable(
    'emails',
    {
        id: serial('id').notNull(),
        uuid: uuid('uuid')
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        name: text('name').notNull(),
        slug: text('slug').notNull(),
        schema: jsonb('schema'),
    },
    (table) => ({
        slugIndex: uniqueIndex('emails_slug_idx').on(table.slug),
    })
)
export const emailLog = pgTable(
    'email_log',
    {
        id: serial('id').notNull().primaryKey().notNull(),
       organisationUuid: uuid('organisation_uuid')
            .notNull()
            .references(() => organisation.uuid, { onDelete: 'cascade' }),
        toAddress: text('to_address').notNull(),
        toName: text('to_name'),
        fromAddress: text('from_address').notNull(),
        fromName: text('from_name'),
        subject: text('subject'),
        content: text('content'),
        contentType: emailTypeEnum('content_type').notNull().default('html'),
        isSent: boolean('isSent').default(false).notNull(),
        isSeeded: boolean('is_seeded').default(false).notNull(),
        createdAt: timestamp('created_at', { mode: 'date' })
            .notNull()
            .defaultNow(),
    },
    (table) => ({
        organisationIndex: index('fk_emaillog_organisation_idx').on(
            table.organisationUuid
        ),
    })
)

export const useage = pgTable('useage', {
    id: serial('id').notNull(),
    uuid: uuid('uuid')
        .default(sql`uuid_generate_v4()`)
        .primaryKey()
        .notNull(),
    planUuid: uuid('plan_uuid')
        .notNull()
        .references(() => plans.uuid, { onDelete: 'cascade' }),
    organisationUuid: uuid('organisation_uuid')
        .notNull()
        .references(() => organisation.uuid, { onDelete: 'cascade' }),
    assetCount: integer('asset_count').default(0),
    assetStorageSize: integer('asset_storage_size').default(0),
    updatedAt: timestamp('updated_at', { mode: 'date' }),
})

export const sessionTable = pgTable('session', {
    id: text('id').notNull().primaryKey(),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.uuid, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', {
        withTimezone: true,
        mode: 'date',
    }).notNull(),
})

export const authTokens = pgTable(
    'auth_token',
    {
        id: serial('id').notNull(),
        organisationUuid: uuid('organisation_uuid')
            .notNull()
            .references(() => organisation.uuid, { onDelete: 'cascade' }),
        type: text('type').notNull(),
        identifier: text('identifier').notNull(),
        name: text('name').notNull().default('default'),
        description: text('description'),
        token: text('token')
            .default(sql`uuid_generate_v4()`)
            .unique()
            .notNull(),
        oneTime: boolean('one_time').default(false).notNull(),
        status: boolean('status').default(true).notNull(),
        expiresAt: timestamp('expires_at', { mode: 'date' }),
        createdAt: timestamp('created_at', { mode: 'date' })
            .notNull()
            .defaultNow(),
    },
    (table) => ({
        compoundKey: primaryKey({
            columns: [table.type, table.identifier, table.token],
        }),
        tokenIndex: index('fk_authtoken_token_idx').on(table.token),
    })
)

export const permissions = pgTable(
    'permissions',
    {
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        id: serial('id').notNull(),
        uuid: uuid('uuid')
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        organisationUuid: uuid('organisation_id')
            .notNull()
            .references(() => organisation.uuid, { onDelete: 'cascade' }),
        slug: varchar('slug', { length: 255 }).notNull(),
        name: varchar('name', { length: 255 }).notNull(),
        createdAt: timestamp('created_at', { mode: 'date' })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
    },
    (table) => ({
        slugIndex: uniqueIndex('permissions_slug_idx').on(
            table.slug,
            table.organisationUuid
        ),
        organisationIndex: index('fk_permission_organisation_idx').on(
            table.organisationUuid
        ),
    })
)

export const roles = pgTable(
    'roles',
    {
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        id: serial('id').notNull(),
        uuid: uuid('uuid')
            .default(sql`uuid_generate_v4()`)
            .primaryKey()
            .notNull(),
        organisationUuid: uuid('organisation_id')
            .notNull()
            .references(() => organisation.uuid, { onDelete: 'cascade' }),
        slug: varchar('slug', { length: 255 }).notNull(),
        name: varchar('name', { length: 255 }).notNull(),
        description: text('description'),
        createdAt: timestamp('created_at', { mode: 'date' })
            .notNull()
            .defaultNow(),

        updatedAt: timestamp('updated_at', { mode: 'date' }),
    },
    (table) => ({
        slugIndex: uniqueIndex('roles_slug_idx').on(
            table.slug,
            table.organisationUuid
        ),
        organisationIndex: index('fk_roles_organisation_idx').on(
            table.organisationUuid
        ),
    })
)

export const rolesPermissions = pgTable(
    'roles_permissions',
    {
        roleUuid: uuid('role_uuid')
            .notNull()
            .references(() => roles.uuid, { onDelete: 'cascade' }),
        permissionUuid: uuid('permission_uuid')
            .notNull()
            .references(() => permissions.uuid, { onDelete: 'cascade' }),
    },
    (table) => {
        return {
            rolesPermissionsPkey: primaryKey({
                columns: [table.roleUuid, table.permissionUuid],
                name: 'roles_permissions_pkey',
            }),
        }
    }
)

export const usersPermissions = pgTable(
    'users_permissions',
    {
        userUuid: uuid('user_uuid')
            .notNull()
            .references(() => users.uuid, { onDelete: 'cascade' }),
        permissionUuid: uuid('permission_uuid')
            .notNull()
            .references(() => permissions.uuid, { onDelete: 'cascade' }),
    },
    (table) => {
        return {
            usersPermissionsPkey: primaryKey({
                columns: [table.userUuid, table.permissionUuid],
                name: 'users_permissions_pkey',
            }),
        }
    }
)

export const usersRoles = pgTable(
    'users_roles',
    {
        userUuid: uuid('user_uuid')
            .notNull()
            .references(() => users.uuid, { onDelete: 'cascade' }),
        roleUuid: uuid('role_uuid')
            .notNull()
            .references(() => roles.uuid, { onDelete: 'cascade' }),
    },
    (table) => {
        return {
            usersRolesPkey: primaryKey({
                columns: [table.userUuid, table.roleUuid],
                name: 'users_roles_pkey',
            }),
        }
    }
)

// ************************************************************
//                         RELATIONS
// ************************************************************

export const problemRelations = relations(problem, ({ many }) => ({
    submissions: many(submission),
}))

export const userRelations = relations(users, ({ one }) => ({
    profileImage: one(media, {
        fields: [users.profileImageId],
        references: [media.uuid],
    }),
}))