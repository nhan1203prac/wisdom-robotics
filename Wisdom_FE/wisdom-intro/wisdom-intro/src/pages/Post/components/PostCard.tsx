import type { Post } from "@/types/post.type";
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Calendar, Tag } from "lucide-react"; 

const getFirstImage = (html: string): string | null => {
  const m = html.match(/<img [^>]*src=["']([^"']+)["']/i);
  return m ? m[1] : null;
};

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const PostCard: React.FC<{ post: Post; onUpdate?: (stat: any) => void }> = ({ post }) => {
  const navigate = useNavigate();
  const thumb = getFirstImage(post.content);
  const plainContent = stripHtml(post.content);

  return (
    <motion.article
      onClick={() => navigate(`/posts/${post.id}`)}
      whileHover={{ y: -6, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer shadow-sm hover:border-blue-200 transition-all flex flex-col h-full ${!post.enabled ? "opacity-50" : ""}`}
    >
      {/* Thumbnail */}
      {thumb ? (
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 shrink-0">
          <img
            src={thumb}
            alt={stripHtml(post.title)}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />
          {post.categoryName && (
            <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-white bg-blue-600/90 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
              <Tag size={10} /> {post.categoryName}
            </span>
          )}
        </div>
      ) : (
        <div className="px-5 pt-5 pb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            {post.categoryName || "Tin tức"}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h2
          className={`font-bold text-slate-900 leading-snug mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 ${thumb ? "text-base" : "text-xl"}`}
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        
        {!thumb && plainContent && (
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-4 mb-4">
            {plainContent}
          </p>
        )}

        {/* ── Footer: Đã làm đậm nét và thêm màu sắc ── */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Avatar có màu nền tự động thay đổi */}
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.authorName)}&background=random&color=fff&bold=true`}
              className="h-8 w-8 rounded-full border-2 border-white shadow-sm shrink-0"
              alt={post.authorName}
            />
            <div className="flex flex-col">
               <span className="text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors">
                  {post.authorName}
               </span>
               <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                  <Calendar size={10} className="text-blue-500" />
                  <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
               </div>
            </div>
          </div>
          
          <div className="text-slate-300">
             <User size={14} />
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default PostCard;