"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@douyinfe/semi-ui";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);

		setIsSubmitting(true);

		try {
			const result = await authClient.signIn.email({ email: email.trim(), password });

			if (result.error) {
				setError(result.error.message ?? "认证失败，请稍后重试");
				return;
			}

			router.replace("/");
			router.refresh();
		} catch {
			setError("认证失败，请检查网络后重试");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form className="space-y-5" onSubmit={handleSubmit}>
			<div>
				<h2 className="text-2xl font-semibold">欢迎回来</h2>
				<p className="mt-2 text-sm text-(--semi-color-text-2)">输入账户信息以继续。</p>
			</div>

			<label className="block space-y-2">
				<span className="text-sm font-medium">邮箱</span>
				<Input
					autoComplete="email"
					type="email"
					placeholder="name@example.com"
					value={email}
					onChange={(value) => setEmail(value)}
				/>
			</label>

			<label className="block space-y-2">
				<span className="text-sm font-medium">密码</span>
				<Input
					autoComplete="current-password"
					type="password"
					placeholder="至少 8 位"
					value={password}
					onChange={(value) => setPassword(value)}
				/>
			</label>

			{error ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm leading-6 text-red-700">{error}</p> : null}

			<Button block htmlType="submit" loading={isSubmitting} size="large" theme="solid" type="primary">
				登录
			</Button>
		</form>
	);
}
