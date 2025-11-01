import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function MemoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memory, setMemory] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // 获取回忆详情
  useEffect(() => {
    axios.get(`http://localhost:8081/memories/${id}`)
      .then(res => {
        if (res.data.code === 200) {
          setMemory(res.data.data);
        }
      }).catch(err => console.error("获取详情失败", err));
  }, [id]);

  // 获取评论列表
  const fetchComments = () => {
    axios.get(`http://localhost:8081/comments/${id}`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        if (Array.isArray(data)) setComments(data);
      })
      .catch(err => console.error("加载评论失败", err));
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  // 发表评论
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("请先登录再留言");
      return;
    }
    if (!newComment.trim()) return;

    try {
      await axios.post("http://localhost:8081/comments", {
        memoryId: id,
        content: newComment
      }, {
        headers: { "X-User-Id": userId }
      });
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("评论失败", err);
      alert("评论失败");
    }
  };

  if (!memory) return <div className="text-center p-8">加载中...</div>;

  const isOwner = memory.user?.id && String(memory.user.id) === userId;
  const canEdit = isAdmin || isOwner;
  const canDelete = isAdmin || isOwner;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        
        {/* 顶部标题与返回 */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{memory.title}</h1>
          <div className="flex gap-2 items-center">
            {canEdit && (
              <button
                onClick={() => navigate(`/memories/${id}/edit`)}
                className="text-sm text-yellow-600 hover:underline"
              >
                ✏️ 补充回忆
              </button>
            )}
            {canDelete && (
              <button
                onClick={async () => {
                  if (confirm("确定要删除这条回忆吗？")) {
                    try {
                      await axios.delete(`http://localhost:8081/memories/${id}`, {
                        headers: { "X-User-Id": userId }
                      });
                      alert("删除成功！");
                      navigate("/");
                    } catch (err) {
                      alert(err.response?.data?.message || "删除失败");
                    }
                  }
                }}
                className="text-sm text-red-500 hover:underline"
              >
                🗑️ 删除回忆
              </button>
            )}
            <button
              onClick={() => navigate("/")}
              className="text-sm text-teal-500 hover:underline"
            >
              ← 返回首页
            </button>
          </div>
        </div>

{/* 元信息 */}
{memory.eventDate && (
  <p className="text-gray-500 text-xs mb-4">Memory日期：{memory.eventDate}</p>
)}
<p className="text-gray-400 text-xs mb-4">Memory修改时间：{memory.createdTime}</p>
<p className="mb-4 text-gray-700">{memory.description}</p>


        {/* 多媒体展示 */}
        <div className="space-y-4 mb-6">
          {memory.mediaList?.map((media, index) => (
            media.mediaType === "IMAGE" ? (
              <img
                key={index}
                src={`http://localhost:8081${media.fileUrl}`}
                alt={`media-${index}`}
                className="w-full h-48 object-cover rounded"
              />
            ) : (
              <video
                key={index}
                src={`http://localhost:8081${media.fileUrl}`}
                controls
                className="w-full h-48 object-cover rounded"
              />
            )
          ))}
        </div>

        {/* 评论区 */}
        <h2 className="text-lg font-semibold mb-2">留言</h2>
        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
          {Array.isArray(comments) && comments.length > 0 ? (
            comments.map((c, idx) => (
              <div key={idx} className="border p-2 rounded">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-800 mb-1">{c.content}</p>
                  {(isAdmin || isOwner) && (
                    <button
                      onClick={async () => {
                        if (!c?.commentId) {
                          alert("评论 ID 不存在");
                          return;
                        }
                        if (confirm("确认删除这条评论吗？")) {
                          try {
                            await axios.delete(`http://localhost:8081/comments/${c.commentId}`, {
                              headers: { "X-User-Id": userId }
                            });
                            fetchComments();
                          } catch (err) {
                            alert(err.response?.data?.message || "删除失败");
                          }
                        }
                      }}
                      className="text-xs text-red-500 hover:underline"
                    >
                      删除
                    </button>
                  )}
                </div>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span className="text-teal-600">{c.userName || "匿名"}</span>
                  <span>{c.createdTime}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">暂无评论</p>
          )}
        </div>

        {/* 发表评论区域：仅登录可见 */}
        {userId ? (
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2 text-sm"
              placeholder="留下你的留言..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded text-sm"
            >
              发送
            </button>
          </form>
        ) : (
          <p className="text-sm text-center text-gray-500 mt-2">
            请 <span className="text-teal-600 font-medium">登录</span> 后才能留言
          </p>
        )}
      </div>
    </div>
  );
}
