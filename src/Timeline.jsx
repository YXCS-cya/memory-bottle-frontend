import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Timeline() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8081/timeline")
      .then(res => {
        if (res.data.code === 200) {
          setEvents(res.data.data);
        }
      })
      .catch(err => console.error("加载时间轴失败", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 顶部返回按钮 */}
        <div className="flex justify-end mb-4">
          <Link to="/">
            <button className="px-4 py-2 text-sm bg-teal-400 text-white rounded hover:bg-teal-500 transition">
              ← 返回首页
            </button>
          </Link>
        </div>

        {/* 标题 */}
        <h1 className="text-2xl font-bold mb-6 text-center">📅 回忆时间轴</h1>

        {/* 时间轴事件列表 */}
        <div className="space-y-6">
          {events.length === 0 ? (
            <p className="text-gray-500 text-center">暂无事件</p>
          ) : (
            events.map((event, idx) => (
              <div key={idx} className="flex justify-center">
                <Link
                  to={`/memories/${event.memoryId}`}
                  className="w-full max-w-4xl bg-white rounded-xl shadow p-4 hover:bg-gray-50 transition border"
                >
                  <div className="flex items-center gap-6">
                    {/* 封面图容器固定尺寸 */}
                    <div className="w-[400px] h-[300px] rounded overflow-hidden flex-shrink-0 bg-black">
                      {event.coverUrl.endsWith('.mp4') ? (
                        <video
                          src={`http://localhost:8081${event.coverUrl}`}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                          controls
                        />
                      ) : (
                        <img
                          src={`http://localhost:8081${event.coverUrl}`}
                          alt="封面"
                          className="w-full h-full object-cover"
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                      )}
                    </div>

                    {/* 文字部分 */}
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-800">{event.title}</h2>
                      <p className="text-sm text-gray-500">{event.eventDate}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
