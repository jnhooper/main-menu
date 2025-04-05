import { relations, sql, type  InferSelectModel } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `jnHooperMenu_${name}`);

export const posts = createTable(
  "post",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    createdByIdIdx: index("created_by_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  })
);

/**
 * a menu belongs to a household
  **/
export const menus = createTable('menu', {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  createdById: varchar("created_by", { length: 255 })
    .references(() => users.id),
  lastUpdatedById: varchar("last_updated_by", { length: 255 })
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
  householdId: varchar('household_id', {length: 255}).notNull()
    .references(() => households.id, {onDelete: 'cascade'}),
  isPrivate: boolean('is_private').default(false)
})

export type SelectMenu = InferSelectModel<typeof menus>

export const menuRelations = relations(menus, ({one, many})=> ({
  household: one(households, {
    fields: [ menus.householdId ],
    references: [households.id]
  }),
  items: many(items)
}))

export const items = createTable('item', {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  createdById: varchar("created_by", { length: 255 })
    .references(() => users.id),
  updatedById: varchar("updated_by", { length: 255 })
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  lastSelected:timestamp("last_selected", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
  imageUrl: text("image_url"),
  link: text("link"),
  description:text("description"),
  isVisible: boolean('is_visible'),
  menuId: varchar('menu_id').notNull()
})

export const apiItem = createInsertSchema(items);
export const apiCreateItem = apiItem.omit({
  id: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
  updatedById: true,
  lastSelected: true,
})

export const itemRelations = relations(items, ({one}) => ({
  menu: one(menus, {
    fields: [items.menuId],
    references: [menus.id],
  })
}));




export const households = createTable('household', {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  headOfHouseholdId: varchar('head_of_household_id').notNull()
})

export type SelectHousehold = InferSelectModel<typeof households>

export const householdsRelations = relations(households,({one, many}) =>({
  headOfHousehold: one(users, {
    fields: [ households.headOfHouseholdId ],
    references: [users.id],
    relationName: 'head_of_household'
  }),
  users: many(usersToHouseholds),
  menus: many(menus)
}))

export const usersToHouseholds = createTable('users_to_households', {
  userId:varchar("user_id", { length: 255 })
  .notNull()
  .references(() => {
    return users.id
  },
    {onDelete: 'cascade'}
  ),
  householdId: varchar("household_id", { length: 255 })
  .notNull()
  .references(
    () => households.id,
    {onDelete: 'cascade'}
  ),
},
  (t) => ( {
    primaryKey: primaryKey({ columns:[ t.userId, t.householdId ] }),
  }),
)

export const usersToHouseholdsRelations = relations(usersToHouseholds, ({one})=>({
  household: one(households, {
    fields: [ usersToHouseholds.householdId ],
    references: [households.id],
  }),
  user: one(users, {
    fields: [ usersToHouseholds.userId ],
    references: [users.id],
  })
}))

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  defaultHouseholdId: varchar("default_household_id", { length: 255 })
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  headOfHouseholds: many(households, {relationName: 'head_of_household'}),
  households: many(usersToHouseholds)
}));



export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);
