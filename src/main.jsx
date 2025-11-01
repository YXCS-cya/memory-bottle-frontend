import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Upload from './Upload.jsx'
import MemoryDetail from './MemoryDetail.jsx'
import './index.css'
import Timeline from './Timeline.jsx'; 
import Login from "./Login.jsx";
import CommentTest from './CommentTest';
import MemoryEdit from "./MemoryEdit";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/login" element={<Login />} />
        <Route path="/memories/:id" element={<MemoryDetail />} />
        <Route path="/test-comments/:id" element={<CommentTest />} />
        <Route path="/memories/:id/edit" element={<MemoryEdit />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
