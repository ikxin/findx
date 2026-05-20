import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Entrant Roster",
	description: "Entrant Roster application",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="zh-CN" className="min-h-full bg-(--semi-color-bg-0)">
			<body className="min-h-full bg-(--semi-color-bg-0)">{children}</body>
		</html>
	);
}
