import React from "react";

export default function AuthItem({ label, img, href }) {
  const handleClick = async (e) => {
    e.preventDefault();
    if (href.includes("/kakao/login")) {
      // 카카오 회원가입: 인증 URL 받아서 바로 이동
      const res = await fetch(href);
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("카카오 인증 URL 생성 실패");
      }
    } else {
      // 네이버/구글 등은 기존 방식 유지
      window.location.href = href;
    }
  };
  return (
    <button className="flex items-center gap-2 px-4 py-2 border rounded bg-white hover:bg-blue-50" onClick={handleClick}>
      <img src={img} alt={label} className="w-6 h-6" />
      <span>{label}</span>
    </button>
  );
}
