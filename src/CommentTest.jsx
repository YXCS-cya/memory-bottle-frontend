import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CommentTest() {
  const { id } = useParams(); // 使用路由参数获取 memoryId
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  axios.get(`http://localhost:8081/comments/${id}`)
    .then(res => {
      const data = Array.isArray(res.data) ? res.data : res.data.data;
      console.log("解析评论成功：", data);
      if (Array.isArray(data)) {
        setComments(data);
      } else {
        console.warn("评论数据不是数组：", data);
      }
    })
    .catch(err => {
      console.error("获取评论失败：", err);
    })
    .finally(() => setLoading(false));
}, [id]);


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">🧪 评论测试页面 (memoryId: {id})</h1>

      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-400">无评论数据</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c, idx) => (
            <div key={idx} className="bg-white p-4 shadow rounded border">
              <p className="text-gray-800">{c.content}</p>
              <div className="text-sm text-gray-500 flex justify-between mt-1">
                <span>{c.userName || "匿名"}</span>
                <span>{c.createdTime}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
