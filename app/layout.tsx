import type { Metadata } from "next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "CROSS CULTURAL CLUB",
  description: "통역사와 함께, 현지인과 여행자가 3:3으로 깊은 대화를 나누는 국제 커뮤니티",
  icons: { icon: "/favicon.svg" },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" style={{ backgroundColor: "#f4f1ec" }}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600&display=swap"
        />
      </head>
      <body style={{ backgroundColor: "#f4f1ec", margin: 0 }}>
        {children}
        {GA_ID && <GoogleAnalytics id={GA_ID} />}
      </body>
    </html>
  );
}
