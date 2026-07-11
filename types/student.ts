import type { students } from "@/lib/schema";

export type Student = typeof students.$inferSelect;

export type StudentListResponse = {
	data: Student[];
	pagination: {
		page: number;
		pageSize: number;
		total: number;
	};
};
