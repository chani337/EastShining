import React, { useState } from "react";

export default function SignUpForm({ onSuccess }) {
  const [form, setForm] = useState({
    user_platform: "email",
    user_inherent: "",
    user_nick: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("회원가입 실패: " + res.status);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input
        name="user_inherent"
        type="email"
        required
        placeholder="이메일"
        value={form.user_inherent}
        onChange={handleChange}
        className="border px-3 py-2 rounded"
      />
      <input
        name="user_nick"
        type="text"
        required
        placeholder="닉네임"
        value={form.user_nick}
        onChange={handleChange}
        className="border px-3 py-2 rounded"
      />
      <input
        name="password"
        type="password"
        required
        placeholder="비밀번호"
        value={form.password}
        onChange={handleChange}
        className="border px-3 py-2 rounded"
      />
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "가입 중..." : "회원가입"}
      </button>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </form>
  );
}
