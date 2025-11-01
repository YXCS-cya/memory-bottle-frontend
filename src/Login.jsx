import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const params = new URLSearchParams();
  params.append("name", name);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("请输入姓名");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8081/auth/login", params, {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
});
      if (res.data.code === 200) {
        const user = res.data.data;
        // 保存登录信息
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("relation", user.relation);
        localStorage.setItem("isAdmin", user.isAdmin);
        alert("登录成功！");
        navigate("/");
      } else {
        setError("登录失败：" + res.data.message);
      }
    } catch (err) {
      console.error("登录请求失败", err);
      setError("网络错误，无法登录");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold text-center mb-4">用户名登录</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="请输入姓名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600 transition"
          >
            登录
          </button>
        </form>
      </div>
    </div>
  );
}
