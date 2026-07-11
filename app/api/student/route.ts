import { asc, count, like, or } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { students } from "@/lib/schema";
import type { StudentListResponse } from "@/types/student";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const MAX_PAGE = 10_000;
const MAX_QUERY_LENGTH = 100;

function getPositiveInteger(value: string | null, fallback: number, maximum: number) {
	if (!value) {
		return fallback;
	}

	const parsed = Number(value);

	if (!Number.isSafeInteger(parsed) || parsed < 1) {
		return fallback;
	}

	return Math.min(parsed, maximum);
}

export async function GET(request: Request) {
	try {
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session) {
			return Response.json({ message: "请先登录后再访问学生数据。" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const query = searchParams.get("query")?.trim() ?? "";

		if (query.length > MAX_QUERY_LENGTH) {
			return Response.json({ message: "查询内容不能超过 100 个字符。" }, { status: 400 });
		}

		const page = getPositiveInteger(searchParams.get("page"), 1, MAX_PAGE);
		const pageSize = getPositiveInteger(searchParams.get("pageSize"), DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
		const where = query
			? or(
					like(students.name, `%${query}%`),
					like(students.candidate_number, `%${query}%`),
					like(students.student_number, `%${query}%`),
				)
			: undefined;
		const db = getDb();
		const [data, [{ total }]] = await Promise.all([
			db
				.select()
				.from(students)
				.where(where)
				.orderBy(asc(students.candidate_number), asc(students.id))
				.limit(pageSize)
				.offset((page - 1) * pageSize),
			db.select({ total: count() }).from(students).where(where),
		]);
		const response: StudentListResponse = {
			data,
			pagination: {
				page,
				pageSize,
				total,
			},
		};

		return Response.json(response, {
			headers: {
				"Cache-Control": "private, no-store",
			},
		});
	} catch {
		return Response.json({ message: "学生数据暂时无法加载，请稍后重试。" }, { status: 500 });
	}
}
