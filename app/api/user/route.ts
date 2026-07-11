import { auth } from "@/lib/auth";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

function isPasswordChangeRequest(value: unknown): value is { currentPassword: string; newPassword: string } {
	if (!value || typeof value !== "object" || Array.isArray(value)) {
		return false;
	}

	const { currentPassword, newPassword } = value as Record<string, unknown>;

	return typeof currentPassword === "string" && typeof newPassword === "string";
}

export async function GET(request: Request) {
	try {
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session) {
			return Response.json({ message: "请先登录后再访问用户信息" }, { status: 401 });
		}

		return Response.json(
			{
				id: session.user.id,
				name: session.user.name,
				email: session.user.email,
				emailVerified: session.user.emailVerified,
				createdAt: session.user.createdAt,
				updatedAt: session.user.updatedAt,
			},
			{
				headers: {
					"Cache-Control": "private, no-store",
				},
			},
		);
	} catch {
		return Response.json({ message: "用户信息暂时无法加载，请稍后重试" }, { status: 500 });
	}
}

export async function PATCH(request: Request) {
	let body: unknown;

	try {
		body = await request.json();
	} catch {
		return Response.json({ message: "请求数据格式不正确" }, { status: 400 });
	}

	if (!isPasswordChangeRequest(body)) {
		return Response.json({ message: "请填写当前密码和新密码" }, { status: 400 });
	}

	const { currentPassword, newPassword } = body;

	if (!currentPassword || newPassword.length < MIN_PASSWORD_LENGTH || newPassword.length > MAX_PASSWORD_LENGTH) {
		return Response.json({ message: "新密码长度需为 8 至 128 个字符" }, { status: 400 });
	}

	if (currentPassword === newPassword) {
		return Response.json({ message: "新密码不能与当前密码相同" }, { status: 400 });
	}

	try {
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session) {
			return Response.json({ message: "请先登录后再修改密码" }, { status: 401 });
		}

		await auth.api.changePassword({
			headers: request.headers,
			body: {
				currentPassword,
				newPassword,
			},
		});

		return Response.json({ message: "密码修改成功" });
	} catch {
		return Response.json({ message: "当前密码不正确或登录状态已失效，请重新登录后再试" }, { status: 400 });
	}
}
