import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
  alert("请先登录再上传");
  return;
}

    if (!title || !eventDate || files.length === 0) {
      alert("请填写完整信息并选择文件");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("eventDate", eventDate);
    files.forEach(file => formData.append("files", file));

    try {
      await axios.post("http://localhost:8081/memories/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-User-Id": userId
          },
      });
      alert("上传成功！");
      navigate("/");
    } catch (err) {
      console.error("上传失败", err);
      alert("上传失败，请检查控制台");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-12 px-4">
      <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        {/* 顶部返回按钮 */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded text-sm bg-teal-400 text-white hover:bg-teal-500 transition"
          >
            ← 返回首页
          </button>
        </div>

        {/* 标题 */}
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">上传回忆</h1>

        {/* 表单区域（居中 + 限宽） */}
        <div className="w-full max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="标题"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-300"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <textarea
              placeholder="描述"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-300"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <input
              type="date"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-300"
              value={eventDate}
              onChange={e => setEventDate(e.target.value)}
            />
            <input
              type="file"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              multiple
              onChange={e => setFiles([...e.target.files])}
            />

            {/* 文件预览区域 */}
            {files.length > 0 && (
              <div className="space-y-2">
                {Array.from(files).map((file, index) => {
                  const url = URL.createObjectURL(file);
                  const isVideo = file.type.startsWith("video");
                  return (
                    <div key={index}>
                      {isVideo ? (
                        <video src={url} controls className="w-full max-h-48 rounded" />
                      ) : (
                        <img src={url} alt={`预览-${index}`} className="w-full max-h-48 object-cover rounded" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded transition"
            >
              📤 提交
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
