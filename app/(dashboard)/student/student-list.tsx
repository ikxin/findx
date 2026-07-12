"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Button, Card, Empty, Input, Pagination, SideSheet, Table, Tag, Toast, Typography } from "@douyinfe/semi-ui";
import type { ColumnProps } from "@douyinfe/semi-ui/lib/es/table/interface";
import { IconEyeOpened, IconRefresh, IconSearch } from "@douyinfe/semi-icons";
import type { Student, StudentListResponse } from "@/types/student";

const { Text, Title } = Typography;

type StudentField = keyof Student;

const fieldLabels: Record<StudentField, string> = {
	id: "记录 ID",
	candidate_number: "考生号",
	name: "姓名",
	identity_number: "身份证号",
	student_number: "学号",
	gender: "性别",
	campus: "校区",
	department_code: "院系代码",
	department_name: "院系名称",
	major_code: "专业代码",
	major_name: "专业名称",
	grade: "年级",
	class_name: "班级",
	source_region: "生源地",
	program_duration: "学制",
	study_status: "学籍状态",
	birth_date: "出生日期",
	political_status: "政治面貌",
	ethnicity: "民族",
	clothing_size: "服装尺码",
	shoe_size: "鞋码",
	registration_status: "报到状态",
	check_in_status: "签到状态",
	checked_in_at: "签到时间",
	subject_category: "科类",
	subject_category_code: "科类代码",
	subject_category_name: "科类名称",
	graduation_school_code: "毕业学校代码",
	graduation_school_name: "毕业学校名称",
	landline_phone: "固定电话",
	mobile_phone: "手机号",
	phone_contact: "联系电话",
	postal_code: "邮政编码",
	mailing_recipient: "邮寄收件人",
	mailing_address: "邮寄地址",
	candidate_category: "考生类别",
	graduation_category: "毕业类别",
	admitted_major_name: "录取专业",
	admission_province: "录取省份",
	home_phone: "家庭电话",
	contact_phone: "紧急联系人电话",
	pre_registration_status: "预报到状态",
	check_in_time_selection: "报到时间选择",
	late_check_in_reason: "延迟报到原因",
	address_title: "地址标题",
	address_longitude: "地址经度",
	address_latitude: "地址纬度",
	administrative_division_code: "行政区划代码",
	address_province: "地址省份",
	address_city: "地址城市",
	address_district: "地址区县",
	address_street: "地址街道",
	address_house_number: "门牌号",
	address_confidence: "地址置信度",
	address_precision: "地址精度",
};

type DetailGroup = {
	title: string;
	fields: StudentField[];
};

const detailTabs: Array<{ itemKey: string; tab: string; groups: DetailGroup[] }> = [
	{
		itemKey: "overview",
		tab: "概览",
		groups: [
			{
				title: "身份信息",
				fields: ["id", "candidate_number", "student_number", "identity_number", "gender", "birth_date", "ethnicity", "political_status"],
			},
			{
				title: "当前状态",
				fields: ["study_status", "registration_status", "pre_registration_status", "check_in_status", "checked_in_at", "check_in_time_selection"],
			},
		],
	},
	{
		itemKey: "academic",
		tab: "学籍与录取",
		groups: [
			{
				title: "院系与专业",
				fields: ["campus", "department_code", "department_name", "major_code", "major_name", "grade", "class_name", "program_duration"],
			},
			{
				title: "招生与毕业",
				fields: [
					"source_region",
					"subject_category",
					"subject_category_code",
					"subject_category_name",
					"candidate_category",
					"graduation_category",
					"admitted_major_name",
					"admission_province",
					"graduation_school_code",
					"graduation_school_name",
				],
			},
		],
	},
	{
		itemKey: "registration",
		tab: "报到",
		groups: [
			{
				title: "报到安排",
				fields: ["registration_status", "pre_registration_status", "check_in_status", "checked_in_at", "check_in_time_selection", "late_check_in_reason"],
			},
			{
				title: "生活信息",
				fields: ["clothing_size", "shoe_size"],
			},
		],
	},
	{
		itemKey: "contact",
		tab: "联系与邮寄",
		groups: [
			{
				title: "联系方式",
				fields: ["landline_phone", "mobile_phone", "phone_contact", "home_phone", "contact_phone"],
			},
			{
				title: "邮寄信息",
				fields: ["postal_code", "mailing_recipient", "mailing_address"],
			},
		],
	},
	{
		itemKey: "address",
		tab: "地址",
		groups: [
			{
				title: "详细地址",
				fields: [
					"address_title",
					"administrative_division_code",
					"address_province",
					"address_city",
					"address_district",
					"address_street",
					"address_house_number",
					"address_longitude",
					"address_latitude",
					"address_confidence",
					"address_precision",
				],
			},
		],
	},
];

const fullWidthFields = new Set<StudentField>(["id", "identity_number", "mailing_address", "address_title", "late_check_in_reason"]);

function displayValue(value: Student[StudentField]) {
	return value === null || value === undefined || value === "" ? "-" : String(value);
}

function DetailGroup({ group, student }: { group: DetailGroup; student: Student }) {
	return (
		<section className="border-t border-(--semi-color-border) py-6 first:border-t-0 first:pt-0">
			<h3 className="text-sm font-semibold text-(--semi-color-text-0)">{group.title}</h3>
			<dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
				{group.fields.map((field) => (
					<div key={field} className={`min-w-0 ${fullWidthFields.has(field) ? "sm:col-span-2" : ""}`}>
						<dt className="text-sm text-(--semi-color-text-2)">{fieldLabels[field]}</dt>
						<dd className="m-0 mt-1 wrap-break-word text-base font-medium leading-6 text-(--semi-color-text-0)">
							{displayValue(student[field])}
						</dd>
					</div>
				))}
			</dl>
		</section>
	);
}

export function StudentList() {
	const router = useRouter();
	const [inputValue, setInputValue] = useState("");
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(20);
	const [reloadKey, setReloadKey] = useState(0);
	const [response, setResponse] = useState<StudentListResponse>({
		data: [],
		pagination: { page: 1, pageSize: 20, total: 0 },
	});
	const [isLoading, setIsLoading] = useState(true);
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
	const [activeDetailTab, setActiveDetailTab] = useState("overview");

	useEffect(() => {
		let isActive = true;

		const loadStudents = async () => {
			setIsLoading(true);

			try {
				const searchParams = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });

				if (query) {
					searchParams.set("query", query);
				}

				const result = await fetch(`/api/student?${searchParams.toString()}`, { cache: "no-store" });

				if (result.status === 401) {
					router.replace("/login");
					router.refresh();
					return;
				}

				if (!result.ok) {
					throw new Error("学生数据加载失败");
				}

				const data = (await result.json()) as StudentListResponse;

				if (isActive) {
					setResponse(data);
				}
			} catch {
				if (isActive) {
					Toast.error("学生数据加载失败，请稍后重试");
				}
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		};

		void loadStudents();

		return () => {
			isActive = false;
		};
	}, [page, pageSize, query, reloadKey, router]);

	const columns = useMemo<ColumnProps<Student>[]>(
		() => [
			{ title: "考生号", dataIndex: "candidate_number", width: 150, ellipsis: true },
			{ title: "姓名", dataIndex: "name", width: 100, ellipsis: true },
			{ title: "学号", dataIndex: "student_number", width: 140, ellipsis: true, render: displayValue },
			{ title: "性别", dataIndex: "gender", width: 72 },
			{ title: "院系", dataIndex: "department_name", width: 160, ellipsis: true },
			{ title: "专业", dataIndex: "major_name", width: 170, ellipsis: true },
			{ title: "年级", dataIndex: "grade", width: 88 },
			{ title: "报到状态", dataIndex: "registration_status", width: 108, ellipsis: true },
			{ title: "签到状态", dataIndex: "check_in_status", width: 108, ellipsis: true },
			{
				title: "操作",
				width: 72,
				fixed: "right",
				render: (_value, record) => (
					<Button
						aria-label={`查看 ${record.name} 的详情`}
						icon={<IconEyeOpened />}
						theme="borderless"
						title="查看详情"
						onClick={() => {
							setActiveDetailTab("overview");
							setSelectedStudent(record);
						}}
					/>
				),
			},
		],
		[],
	);

	const handleSearch = () => {
		setPage(1);
		setQuery(inputValue.trim());
	};

	const handlePageSizeChange = (nextPageSize: number) => {
		setPage(1);
		setPageSize(nextPageSize);
	};

	const selectedDetailTab = detailTabs.find((tab) => tab.itemKey === activeDetailTab) ?? detailTabs[0];

	return (
		<main className="flex w-full flex-col gap-6">
			<header className="flex flex-col gap-1">
				<Title heading={3}>学生管理</Title>
				<Text type="secondary">查询学生基础信息、学籍、报到与联系信息。</Text>
			</header>

			<Card className="overflow-hidden">
				<div className="flex flex-col gap-4">
					<div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
						<form
							className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-2xl"
							onSubmit={(event) => {
								event.preventDefault();
								handleSearch();
							}}
						>
							<Input
								className="w-full"
								maxLength={100}
								placeholder="按姓名、考生号或学号查询"
								prefix={<IconSearch />}
								showClear
								value={inputValue}
								onChange={setInputValue}
							/>
							<Button aria-label="查询学生" htmlType="submit" icon={<IconSearch />} theme="solid" type="primary" />
						</form>

						<div className="flex items-center justify-between gap-3 lg:justify-end">
							<Text type="secondary">共 {response.pagination.total} 条记录</Text>
							<Button
								aria-label="刷新学生数据"
								disabled={isLoading}
								icon={<IconRefresh />}
								theme="borderless"
								title="刷新"
								onClick={() => setReloadKey((current) => current + 1)}
							/>
						</div>
					</div>

					<div className="overflow-x-auto">
						<Table
							columns={columns}
							dataSource={response.data}
							empty={<Empty title="暂无学生数据" description="请调整查询条件后重试。" />}
							loading={isLoading}
							pagination={false}
							rowKey="id"
							scroll={{ x: 1168 }}
						/>
					</div>

					<div className="flex justify-end">
						<Pagination
							currentPage={response.pagination.page}
							disabled={isLoading}
							pageSize={response.pagination.pageSize}
							pageSizeOpts={[10, 20, 50, 100]}
							showQuickJumper
							showSizeChanger
							total={response.pagination.total}
							onPageChange={setPage}
							onPageSizeChange={handlePageSizeChange}
						/>
					</div>
				</div>
			</Card>

			<SideSheet
				aria-label="学生详情"
				bodyStyle={{ display: "flex", minHeight: 0, overflow: "hidden", padding: 0 }}
				placement="right"
				title="学生档案"
				visible={Boolean(selectedStudent)}
				width="min(56rem, 100vw)"
				onCancel={() => setSelectedStudent(null)}
			>
				{selectedStudent ? (
					<div className="flex min-h-0 flex-1 flex-col">
						<div className="shrink-0 px-6 pt-6">
							<div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between">
								<div className="flex min-w-0 items-center gap-4">
									<Avatar alt={selectedStudent.name} color="blue" size="large">
										{selectedStudent.name.slice(0, 1)}
									</Avatar>
									<div className="min-w-0">
										<h2 className="truncate text-xl font-semibold text-(--semi-color-text-0)">{selectedStudent.name}</h2>
										<p className="mt-1 text-sm text-(--semi-color-text-2)">考生号 {selectedStudent.candidate_number}</p>
									</div>
								</div>
								<div className="flex flex-wrap gap-2">
									<Tag color="blue">{displayValue(selectedStudent.campus)}</Tag>
									<Tag color="green">{displayValue(selectedStudent.registration_status)}</Tag>
									<Tag color="orange">{displayValue(selectedStudent.check_in_status)}</Tag>
								</div>
							</div>
						</div>

						<div className="shrink-0 border-b border-(--semi-color-border) px-6">
							<div aria-label="学生信息分类" className="flex gap-6 overflow-x-auto" role="tablist">
								{detailTabs.map((tab) => {
									const isActive = tab.itemKey === selectedDetailTab.itemKey;

									return (
										<button
											key={tab.itemKey}
											aria-controls={`student-detail-${tab.itemKey}`}
											aria-selected={isActive}
											className={`shrink-0 border-b-2 px-1 py-4 text-sm transition-colors ${
												isActive
													? "border-blue-600 font-semibold text-(--semi-color-text-0)"
													: "border-transparent text-(--semi-color-text-2) hover:text-(--semi-color-text-0)"
											}`}
											id={`student-tab-${tab.itemKey}`}
											role="tab"
											type="button"
											onClick={() => setActiveDetailTab(tab.itemKey)}
										>
											{tab.tab}
										</button>
									);
								})}
							</div>
						</div>

						<div
							aria-labelledby={`student-tab-${selectedDetailTab.itemKey}`}
							className="min-h-0 flex-1 overflow-y-auto px-6 py-6"
							id={`student-detail-${selectedDetailTab.itemKey}`}
							role="tabpanel"
						>
							{selectedDetailTab.groups.map((group) => (
								<DetailGroup key={group.title} group={group} student={selectedStudent} />
							))}
						</div>
					</div>
				) : null}
			</SideSheet>
		</main>
	);
}
