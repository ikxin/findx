"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Empty, Input, Toast, Typography } from "@douyinfe/semi-ui";
import { IconRefresh } from "@douyinfe/semi-icons";
import type { UserProfile } from "@/types/user";

const { Text, Title } = Typography;

function formatDate(value: string) {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return "-";
	}

	return new Intl.DateTimeFormat("zh-CN", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
}

export function UserManagement() {
	const router = useRouter();
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [isLoadingProfile, setIsLoadingProfile] = useState(true);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		let isActive = true;

		const loadProfile = async () => {
			setIsLoadingProfile(true);

			try {
				const response = await fetch("/api/user", { cache: "no-store" });

				if (response.status === 401) {
					router.replace("/login");
					router.refresh();
					return;
				}

				if (!response.ok) {
					throw new Error("用户信息加载失败");
				}

				const data = (await response.json()) as UserProfile;

				if (isActive) {
					setProfile(data);
				}
			} catch {
				if (isActive) {
					Toast.error("用户信息加载失败，请稍后重试");
				}
			} finally {
				if (isActive) {
					setIsLoadingProfile(false);
				}
			}
		};

		void loadProfile();

		return () => {
			isActive = false;
		};
	}, [router]);

	const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (newPassword.length < 8) {
			Toast.warning("新密码至少需要 8 个字符");
			return;
		}

		if (newPassword !== confirmPassword) {
			Toast.warning("两次输入的新密码不一致");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/user", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ currentPassword, newPassword }),
			});
			const data = (await response.json()) as { message?: string };

			if (response.status === 401) {
				router.replace("/login");
				router.refresh();
				return;
			}

			if (!response.ok) {
				throw new Error(data.message ?? "密码修改失败，请稍后重试");
			}

			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			Toast.success(data.message ?? "密码修改成功");
		} catch (error) {
			Toast.error(error instanceof Error ? error.message : "密码修改失败，请稍后重试");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="flex w-full flex-col gap-6">
			<header className="flex flex-col gap-1">
				<Title heading={3}>用户管理</Title>
				<Text type="secondary">查看当前登录账户，并维护账户密码。</Text>
			</header>

			<Card title="账户信息">
				{isLoadingProfile ? (
					<div className="flex min-h-32 items-center justify-center text-sm text-(--semi-color-text-2)">正在加载账户信息...</div>
				) : profile ? (
					<dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
						<div className="min-w-0">
							<dt className="text-sm text-(--semi-color-text-2)">名称</dt>
							<dd className="m-0 mt-1 wrap-break-word text-base font-medium text-(--semi-color-text-0)">{profile.name}</dd>
						</div>
						<div className="min-w-0">
							<dt className="text-sm text-(--semi-color-text-2)">邮箱</dt>
							<dd className="m-0 mt-1 break-all text-base font-medium text-(--semi-color-text-0)">{profile.email}</dd>
						</div>
						<div className="min-w-0">
							<dt className="text-sm text-(--semi-color-text-2)">账户创建时间</dt>
							<dd className="m-0 mt-1 text-base font-medium text-(--semi-color-text-0)">{formatDate(profile.createdAt)}</dd>
						</div>
						<div className="min-w-0">
							<dt className="text-sm text-(--semi-color-text-2)">最近更新时间</dt>
							<dd className="m-0 mt-1 text-base font-medium text-(--semi-color-text-0)">{formatDate(profile.updatedAt)}</dd>
						</div>
					</dl>
				) : (
					<div className="flex min-h-32 flex-col items-center justify-center gap-4">
						<Empty title="用户信息暂时不可用" description="请稍后刷新页面重新加载。" />
						<Button icon={<IconRefresh />} onClick={() => router.refresh()}>
							刷新页面
						</Button>
					</div>
				)}
			</Card>

			<Card title="修改密码" className="max-w-2xl">
				<form className="flex flex-col gap-5" onSubmit={handlePasswordChange}>
					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium text-(--semi-color-text-0)">当前密码</span>
						<Input
							autoComplete="current-password"
							mode="password"
							placeholder="请输入当前密码"
							required
							value={currentPassword}
							onChange={setCurrentPassword}
						/>
					</label>

					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium text-(--semi-color-text-0)">新密码</span>
						<Input
							autoComplete="new-password"
							mode="password"
							minLength={8}
							placeholder="请输入至少 8 个字符的新密码"
							required
							value={newPassword}
							onChange={setNewPassword}
						/>
					</label>

					<label className="flex flex-col gap-2">
						<span className="text-sm font-medium text-(--semi-color-text-0)">确认新密码</span>
						<Input
							autoComplete="new-password"
							mode="password"
							minLength={8}
							placeholder="请再次输入新密码"
							required
							value={confirmPassword}
							onChange={setConfirmPassword}
						/>
					</label>

					<div className="flex justify-end">
						<Button htmlType="submit" loading={isSubmitting} theme="solid" type="primary">
							保存新密码
						</Button>
					</div>
				</form>
			</Card>
		</main>
	);
}
