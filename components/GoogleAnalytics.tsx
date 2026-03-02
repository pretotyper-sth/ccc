"use client";

import { useEffect } from "react";

export default function GoogleAnalytics({ id }: { id: string }) {
  useEffect(() => {
    if (!id) return;

    // gtag.js 외부 스크립트 로드
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    script.async = true;
    document.head.appendChild(script);

    // dataLayer + gtag 초기화
    window.dataLayer = window.dataLayer || [];
    // eslint-disable-next-line prefer-rest-params
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", id, { send_page_view: false });
  }, [id]);

  return null;
}
