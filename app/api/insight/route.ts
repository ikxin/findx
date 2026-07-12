import { and, count, isNotNull } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { gcj02ToWgs84 } from "@/lib/geo";
import { students } from "@/lib/schema";
import type { InsightResponse, InsightStudent } from "@/types/insight";

function hasValidCoordinates(longitude: number, latitude: number) {
	return Number.isFinite(longitude) && Number.isFinite(latitude) && longitude >= -180 && longitude <= 180 && latitude >= -90 && latitude <= 90;
}

export async function GET(request: Request) {
	try {
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session) {
			return Response.json({ message: "请先登录后再访问学生地图" }, { status: 401 });
		}

		const db = getDb();
		const [rows, [{ totalStudents }]] = await Promise.all([
			db
				.select({
					id: students.id,
					name: students.name,
					studentNumber: students.student_number,
					departmentName: students.department_name,
					majorName: students.major_name,
					grade: students.grade,
					className: students.class_name,
					addressTitle: students.address_title,
					addressProvince: students.address_province,
					addressCity: students.address_city,
					addressDistrict: students.address_district,
					addressStreet: students.address_street,
					addressHouseNumber: students.address_house_number,
					longitude: students.address_longitude,
					latitude: students.address_latitude,
				})
				.from(students)
				.where(and(isNotNull(students.address_longitude), isNotNull(students.address_latitude))),
			db.select({ totalStudents: count() }).from(students),
		]);
		const data = rows.flatMap<InsightStudent>((student) => {
			if (student.longitude === null || student.latitude === null || !hasValidCoordinates(student.longitude, student.latitude)) {
				return [];
			}

			const [longitude, latitude] = gcj02ToWgs84(student.longitude, student.latitude);
			return [{ ...student, longitude, latitude }];
		});
		const response: InsightResponse = {
			data,
			summary: {
				totalStudents,
				locatedStudents: data.length,
				unlocatedStudents: totalStudents - data.length,
			},
		};

		return Response.json(response, {
			headers: {
				"Cache-Control": "private, no-store",
			},
		});
	} catch {
		return Response.json({ message: "学生地图数据暂时无法加载，请稍后重试" }, { status: 500 });
	}
}
