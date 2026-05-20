"use client";

import { Avatar, Button, Card, Empty, Typography } from "@douyinfe/semi-ui";
import { IconArrowRight, IconEdit, IconGridView, IconStop, IconTickCircle } from "@douyinfe/semi-icons";

const { Text, Title } = Typography;

const summaryCards = [
	{
		label: "参赛者总数",
		value: "8",
		icon: <IconGridView size="large" />,
		color: "light-blue" as const,
	},
	{
		label: "草稿",
		value: "0",
		icon: <IconEdit size="large" />,
		color: "amber" as const,
	},
	{
		label: "已发布",
		value: "8",
		icon: <IconTickCircle size="large" />,
		color: "green" as const,
	},
	{
		label: "已停用",
		value: "0",
		icon: <IconStop size="large" />,
		color: "grey" as const,
	},
];

export default function Home() {
	return (
		<main className="mx-auto flex w-full max-w-7xl flex-col gap-6 xl:gap-7">
			<Title heading={3} className="text-center md:text-left">
				仪表盘
			</Title>

			<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{summaryCards.map((card) => (
					<Card key={card.label} shadows="hover" className="min-h-32">
						<div className="flex h-full items-center justify-between gap-4">
							<div className="flex min-w-0 flex-col gap-1">
								<Text type="secondary">{card.label}</Text>
								<Title heading={3}>{card.value}</Title>
							</div>
							<Avatar color={card.color} shape="square" size="large" alt={card.label}>
								{card.icon}
							</Avatar>
						</div>
					</Card>
				))}
			</section>

			<section className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,2fr)] xl:grid-cols-[minmax(300px,0.9fr)_minmax(0,2.1fr)]">
				<Card title="待审批" className="min-h-72">
					<div className="flex min-h-56 flex-col items-center justify-center gap-4">
						<Title heading={2} type="warning">
							0
						</Title>
						<Text type="secondary">待处理的审批请求</Text>
						<Button theme="borderless" type="primary" icon={<IconArrowRight />} iconPosition="right">
							查看全部
						</Button>
					</div>
				</Card>

				<Card title="最近变更" className="min-h-72">
					<div className="flex min-h-56 items-center justify-center">
						<Empty title="暂无变更记录" description="新的审核、发布或停用操作会显示在这里。" />
					</div>
				</Card>
			</section>
		</main>
	);
}
