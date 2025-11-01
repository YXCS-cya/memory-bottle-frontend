import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [memories, setMemories] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(0);
  const size = 2; // 每页条数
  const [totalPages, setTotalPages] = useState(0);

  const fetchMemories = () => {
    axios.get("http://localhost:8081/memories", {
      params: {
        keyword: keyword.trim() || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page,
        size
      }
    })
      .then(res => {
        if (res.data.code === 200) {
          const data = res.data.data;
          setMemories(data.content);
          setTotalPages(data.totalPages);
        }
      })
      .catch(err => console.error("加载失败", err));
  };

  useEffect(() => {
    fetchMemories();
  }, [page]);

  const handleSearch = () => {
    setPage(0);
    fetchMemories();
  };

  return (
    <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">记忆时光瓶</h1>
{/* 顶部右上角登录状态 */}
  <div className="flex justify-end mb-2">
    {localStorage.getItem("userId") ? (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        👤 已登录：{localStorage.getItem("userName")}（{localStorage.getItem("relation")}）
        <button
          className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => {
            localStorage.clear();
            alert("已退出登录");
            window.location.reload();
          }}
        >
          退出
        </button>
      </div>
    ) : (
      <Link to="/login">
        <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">
          登录
        </button>
      </Link>
    )}
  </div>
      {/* 顶部操作区 */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <Link to="/upload">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">➕ 添加回忆</button>
        </Link>
        <Link to="/timeline">
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">🕰️ 时间轴</button>
        </Link>

      </div>

      {/* 搜索过滤栏 */}
      <div className="max-w-4xl mx-auto flex flex-wrap gap-3 mb-6 justify-center">
        <input
          type="text"
          placeholder="关键词（标题）"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />
        <input
          type="date"
          
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
        >
          🔍 搜索
        </button>
      </div>

      {/* 回忆列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">暂无符合条件的回忆</p>
        ) : (
          memories.map(memory => (
            <div key={memory.id} className="border rounded-xl shadow p-4 bg-white flex flex-col">
              {memory.mediaList.length > 0 ? (
                memory.mediaList[0].mediaType === 'IMAGE' ? (
                  <img
                    src={`http://localhost:8081${memory.mediaList[0].fileUrl}`}
                    alt="封面"
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                ) : (
                  <video
                    src={`http://localhost:8081${memory.mediaList[0].fileUrl}`}
                    className="w-full h-32 object-cover rounded mb-2"
                    muted
                    preload="metadata"
                    controls
                  />
                )
              ) : (
                <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center text-gray-500">
                  无媒体
                </div>
              )}

              <h2 className="text-lg font-semibold">{memory.title}</h2>
              <p className="text-gray-600 text-sm">{memory.description}</p>
              <p className="text-xs text-right mt-2 text-gray-400">{memory.eventDate}</p>

              <div className="mt-4 text-right">
                <Link to={`/memories/${memory.id}`}>
                  <button className="text-sm text-teal-600 hover:underline">查看详情 →</button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 分页控制 */}
      {totalPages > 1 && (
  <div className="mt-8 flex justify-center gap-4 text-sm">
    <button
      onClick={() => {
        setPage(p => Math.max(p - 1, 0));
        window.scrollTo(0, 0);
      }}
      disabled={page === 0}
      className="px-4 py-1 border rounded disabled:opacity-50"
    >
      ← 上一页
    </button>
    <span className="py-1">第 {page + 1} 页 / 共 {totalPages} 页</span>
    <button
      onClick={() => {
        setPage(p => Math.min(p + 1, totalPages - 1));
        window.scrollTo(0, 0);
      }}
      disabled={page === totalPages - 1}
      className="px-4 py-1 border rounded disabled:opacity-50"
    >
      下一页 →
    </button>
  </div>
)}

    </div>
  );
}
