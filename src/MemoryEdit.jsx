import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function MemoryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const [memory, setMemory] = useState(null);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8081/memories/${id}`)
      .then(res => {
        if (res.data.code === 200) {
          const data = res.data.data;
          setMemory(data);
          setDescription(data.description || "");
        }
      })
      .catch(err => {
        console.error("加载回忆失败", err);
        alert("加载失败");
        navigate("/");
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    files.forEach(file => formData.append("mediaList", file));

    try {
      await axios.put(`http://localhost:8081/memories/${id}?description=${encodeURIComponent(description)}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-User-Id": userId
        }
      });
      alert("修改成功！");
      navigate(`/memories/${id}`);
    } catch (err) {
      console.error("提交失败", err);
      alert(err.response?.data?.message || "修改失败");
    }
  };

  if (!memory) {
    return <div className="text-center p-8">加载中...</div>;
  }

  const isOwner = memory.user && String(memory.user.id) === userId;
  const canEdit = isAdmin || isOwner;

  if (!canEdit) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">❌ 无权限编辑该回忆！</p>
        <button onClick={() => navigate("/")} className="text-teal-500 underline">返回首页</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold text-gray-800">✏️ 补充回忆内容</h1>
          <button onClick={() => navigate(`/memories/${id}`)} className="text-sm text-teal-500 hover:underline">
            ← 返回详情
          </button>
        </div>

        {/* 原内容展示 */}
        <div>
          <h2 className="text-lg font-semibold">{memory.title}</h2>
          <p className="text-sm text-gray-600 mb-2">{memory.createdTime}</p>
          <p className="text-gray-700 mb-3">{memory.description}</p>
          <div className="grid grid-cols-2 gap-2">
            {Array.isArray(memory.mediaList) && memory.mediaList.map((media, i) =>
              media.mediaType === "IMAGE" ? (
                <img key={i} src={`http://localhost:8081${media.fileUrl}`} alt={`media-${i}`} className="h-32 w-full object-cover rounded" />
              ) : (
                <video key={i} src={`http://localhost:8081${media.fileUrl}`} controls className="h-32 w-full object-cover rounded" />
              )
            )}
          </div>
        </div>

        {/* 表单部分 */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t mt-4">
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="修改描述..."
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="file"
            multiple
            onChange={e => setFiles([...e.target.files])}
            className="w-full border px-3 py-2 rounded"
          />
          <button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded">
            ✅ 提交修改
          </button>
        </form>
      </div>
    </div>
  );
}
