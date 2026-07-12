export type InsightStudent = {
	id: string;
	name: string;
	studentNumber: string | null;
	departmentName: string;
	majorName: string;
	grade: number;
	className: string | null;
	addressTitle: string | null;
	addressProvince: string | null;
	addressCity: string | null;
	addressDistrict: string | null;
	addressStreet: string | null;
	addressHouseNumber: string | null;
	longitude: number;
	latitude: number;
};

export type InsightResponse = {
	data: InsightStudent[];
	summary: {
		totalStudents: number;
		locatedStudents: number;
		unlocatedStudents: number;
	};
};
