import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { v7 as uuidv7 } from "uuid";

export const users = sqliteTable(
	"users",
	{
		id: text("id").primaryKey().$defaultFn(() => uuidv7()),
		name: text("name").notNull(),
		email: text("email").notNull(),
		email_verified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
		image: text("image"),
		created_at: integer("created_at", { mode: "timestamp_ms" }).notNull(),
		updated_at: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
	},
	(table) => [uniqueIndex("users_email_unique").on(table.email)],
);

export const students = sqliteTable(
	"students",
	{
		id: text("id").primaryKey().$defaultFn(() => uuidv7()),
		candidate_number: text("candidate_number").notNull(),
		name: text("name").notNull(),
		identity_number: text("identity_number").notNull(),
		student_number: text("student_number"),
		gender: text("gender").notNull(),
		campus: text("campus").notNull(),
		department_code: text("department_code").notNull(),
		department_name: text("department_name").notNull(),
		major_code: text("major_code").notNull(),
		major_name: text("major_name").notNull(),
		grade: integer("grade").notNull(),
		class_name: text("class_name"),
		source_region: text("source_region"),
		program_duration: real("program_duration").notNull(),
		study_status: text("study_status"),
		birth_date: text("birth_date"),
		political_status: text("political_status"),
		ethnicity: text("ethnicity"),
		clothing_size: text("clothing_size"),
		shoe_size: text("shoe_size"),
		registration_status: text("registration_status").notNull(),
		check_in_status: text("check_in_status").notNull(),
		checked_in_at: text("checked_in_at"),
		subject_category: text("subject_category").notNull(),
		subject_category_code: text("subject_category_code"),
		subject_category_name: text("subject_category_name"),
		graduation_school_code: text("graduation_school_code"),
		graduation_school_name: text("graduation_school_name"),
		landline_phone: text("landline_phone"),
		mobile_phone: text("mobile_phone"),
		phone_contact: text("phone_contact"),
		postal_code: text("postal_code"),
		mailing_recipient: text("mailing_recipient"),
		mailing_address: text("mailing_address"),
		candidate_category: text("candidate_category"),
		graduation_category: text("graduation_category"),
		admitted_major_name: text("admitted_major_name").notNull(),
		admission_province: text("admission_province").notNull(),
		home_phone: text("home_phone"),
		contact_phone: text("contact_phone"),
		pre_registration_status: text("pre_registration_status").notNull(),
		check_in_time_selection: text("check_in_time_selection"),
		late_check_in_reason: text("late_check_in_reason"),
		address_title: text("address_title"),
		address_longitude: real("address_longitude"),
		address_latitude: real("address_latitude"),
		administrative_division_code: text("administrative_division_code"),
		address_province: text("address_province"),
		address_city: text("address_city"),
		address_district: text("address_district"),
		address_street: text("address_street"),
		address_house_number: text("address_house_number"),
		address_confidence: integer("address_confidence"),
		address_precision: integer("address_precision"),
	},
);

export const sessions = sqliteTable(
	"sessions",
	{
		id: text("id").primaryKey().$defaultFn(() => uuidv7()),
		expires_at: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
		token: text("token").notNull(),
		created_at: integer("created_at", { mode: "timestamp_ms" }).notNull(),
		updated_at: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
		ip_address: text("ip_address"),
		user_agent: text("user_agent"),
		user_id: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
	},
	(table) => [uniqueIndex("sessions_token_unique").on(table.token), index("sessions_user_id_idx").on(table.user_id)],
);

export const accounts = sqliteTable(
	"accounts",
	{
		id: text("id").primaryKey().$defaultFn(() => uuidv7()),
		account_id: text("account_id").notNull(),
		provider_id: text("provider_id").notNull(),
		user_id: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		access_token: text("access_token"),
		refresh_token: text("refresh_token"),
		id_token: text("id_token"),
		access_token_expires_at: integer("access_token_expires_at", { mode: "timestamp_ms" }),
		refresh_token_expires_at: integer("refresh_token_expires_at", { mode: "timestamp_ms" }),
		scope: text("scope"),
		password: text("password"),
		created_at: integer("created_at", { mode: "timestamp_ms" }).notNull(),
		updated_at: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
	},
	(table) => [
		uniqueIndex("accounts_provider_account_unique").on(table.provider_id, table.account_id),
		index("accounts_user_id_idx").on(table.user_id),
	],
);

export const verifications = sqliteTable(
	"verifications",
	{
		id: text("id").primaryKey().$defaultFn(() => uuidv7()),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expires_at: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
		created_at: integer("created_at", { mode: "timestamp_ms" }).notNull(),
		updated_at: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
	},
	(table) => [index("verifications_identifier_idx").on(table.identifier)],
);
