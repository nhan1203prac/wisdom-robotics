import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Loader2, Send, X, CornerDownRight,
  ThumbsUp, ThumbsDown, MessageSquare, Star,
  Lock, Unlock, MessageCircleOff, MessageCircle,
  HeartOff, Heart, PencilLine, Trash2, MoreHorizontal, ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import postApi from "@/service/api/post.api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import type { Post, Comment } from "@/types/post.type";
import type { UserResponse } from "@/types/user.type";
import "./styles/article-content.css";

const PostDetailPage = ({ currentUser }: { currentUser: UserResponse | null }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [showReplies, setShowReplies] = useState<Record<number, boolean>>({});
  const [childLoading, setChildLoading] = useState<Record<number, boolean>>({});

  const [hoverStar, setHoverStar] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  const stompRef = useRef<Client | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const mergePost = (partial: Partial<Post>) =>
    setPost((p) => (p ? { ...p, ...partial } : p));

  const mergeToggle = (d: any) =>
    setPost((p) => p ? {
      ...p,
      enabled: d.enabled ?? p.enabled,
      commentEnabled: d.commentEnabled ?? p.commentEnabled,
      reactionEnabled: d.reactionEnabled ?? p.reactionEnabled,
    } : p);

  /* ── 1. Fetch Post ── */
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    postApi.getById(id)
      .then((res: any) => {
        if (res.data.success) setPost(res.data.data);
        else navigate("/posts");
      })
      .catch(() => navigate("/posts"))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id, navigate]);

  /* ── 2. Load Comments ── */
  useEffect(() => {
    if (!isCommentsOpen || !post?.id || comments.length > 0) return;
    setCommentsLoading(true);
    postApi.getComments(post.id, 0, 100)
      .then((res: any) => {
        if (res.data.success) setComments(res.data.data.content || []);
      })
      .finally(() => setCommentsLoading(false));
  }, [isCommentsOpen, post?.id]);

  /* ── 3. WebSocket ── */
  useEffect(() => {
    if (!post?.commentEnabled || !post?.id) return;
    if (stompRef.current?.active) return;

    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        setSocketConnected(true);
        client.subscribe(`/topic/posts/${post.id}`, (msg) => {
          const newComment: Comment = JSON.parse(msg.body);
          setComments((prev) => {
            if (prev.find((c) => c.id === newComment.id)) return prev;
            if (newComment.parentId) {
              return prev
                .map((c) => c.id === newComment.parentId ? { ...c, replyCount: (c.replyCount || 0) + 1 } : c)
                .concat(newComment);
            }
            return [...prev, newComment];
          });
          mergePost({ commentCount: (post.commentCount || 0) + 1 });
          if (isCommentsOpen) setTimeout(scrollToBottom, 100);
        });
      },
      onStompError: () => setSocketConnected(false),
    });
    client.activate();
    stompRef.current = client;
    return () => { stompRef.current?.deactivate(); };
  }, [post?.id, post?.commentEnabled, isCommentsOpen]);

  /* ── 4. Actions ── */
  const handleReact = async (type: "LIKE" | "DISLIKE") => {
    if (!post?.reactionEnabled) return;
    const res = (await postApi.react(post!.id, type)) as any;
    if (res.data.success) mergePost(res.data.data);
  };

  const handleRate = async (stars: number) => {
    if (!user) return alert("Vui lòng đăng nhập!");
    const res = (await postApi.rate(post!.id, stars)) as any;
    if (res.data.success) mergePost(res.data.data);
  };

  const handleToggleStatus = async (type: "POST" | "COMMENT" | "REACT") => {
    if (!post) return;
    const res = (await postApi.toggleStatus(post.id, type)) as any;
    if (res.data.success) {
      mergeToggle(res.data.data);
      setShowMenu(false);
      if (type === "COMMENT" && !res.data.data.commentEnabled) {
        setIsCommentsOpen(false);
        stompRef.current?.deactivate();
        setSocketConnected(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!post || !window.confirm("Xóa bài viết này?")) return;
    const res = (await postApi.delete(post.id)) as any;
    if (res.data.success) navigate("/posts");
  };

  const handleSendComment = async () => {
    if (!commentText.trim() || !post?.commentEnabled) return;
    const res = (await postApi.comment(post!.id, commentText, replyingTo?.id)) as any;
    if (res.data.success) { setCommentText(""); setReplyingTo(null); }
  };

  /* CẬP NHẬT: Xử lý màu sắc Like/Dislike cho Comment */
  const handleCommentReact = async (commentId: number, type: "LIKE" | "DISLIKE") => {
    if (!user) return alert("Vui lòng đăng nhập để tương tác!");
    
    const res = (await postApi.reactToComment(commentId, type)) as any;
    if (res.data.success) {
      const updatedStat = res.data.data;
      
      setComments((prev) => prev.map((c) => {
        if (c.id === commentId) {
        
          return { 
            ...c, 
            ...updatedStat,
            userLiked: type === "LIKE" ? !c.userLiked : false,
            userDisliked: type === "DISLIKE" ? !c.userDisliked : false
          };
        }
        return c;
      }));
    }
  };

  const toggleReplies = async (parentId: number) => {
    if (showReplies[parentId]) { setShowReplies((p) => ({ ...p, [parentId]: false })); return; }
    setChildLoading((p) => ({ ...p, [parentId]: true }));
    const res = (await postApi.getReplies(parentId, 0, 50)) as any;
    if (res.data.success) {
      const fetched = res.data.data.content || [];
      setComments((prev) => [
        ...prev.filter((c) => c.parentId !== parentId && !fetched.some((r: any) => r.id === c.id)),
        ...fetched,
      ]);
      setShowReplies((p) => ({ ...p, [parentId]: true }));
    }
    setChildLoading((p) => ({ ...p, [parentId]: false }));
  };

  /* ── 5. Render Comment ── */
  const renderComment = (comment: Comment, isReply = false) => {
    const directChildren = comments.filter((c) => c.parentId === comment.id);
    return (
      <div key={comment.id} className={`flex gap-3 ${isReply ? "mt-4" : "mt-6"}`}>
        <img
          src={`https://ui-avatars.com/api/?name=${comment.authorName}&background=random`}
          className={`${isReply ? "h-7 w-7" : "h-9 w-9"} rounded-full border border-slate-200 shrink-0`}
          alt="avatar"
        />
        <div className="flex-1 space-y-1">
          <div className="bg-white/80 px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-xs font-bold text-slate-800">{comment.authorName}</span>
              <span className="text-[9px] text-slate-400">{comment.timestamp}</span>
            </div>
            <p className="text-sm text-slate-700 leading-normal">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4 ml-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            {/* Nút Like Bình luận */}
            <button 
              onClick={() => handleCommentReact(comment.id, "LIKE")} 
              className={`flex items-center gap-1 transition-colors ${comment.userLiked ? "text-blue-600" : "hover:text-blue-600"}`}
            >
              <ThumbsUp size={12} className={comment.userLiked ? "fill-current" : ""} /> {comment.likeCount || 0}
            </button>

            {/* Nút Dislike Bình luận */}
            <button 
              onClick={() => handleCommentReact(comment.id, "DISLIKE")} 
              className={`flex items-center gap-1 transition-colors ${comment.userDisliked ? "text-red-600" : "hover:text-red-600"}`}
            >
              <ThumbsDown size={12} className={comment.userDisliked ? "fill-current" : ""} /> {comment.dislikeCount || 0}
            </button>

            {post?.commentEnabled && (
              <button onClick={() => setReplyingTo(comment)} className="hover:text-slate-800 transition-colors">Trả lời</button>
            )}
          </div>
          {(comment.replyCount > 0 || directChildren.length > 0) && (
            <div className="ml-2 mt-2">
              <button onClick={() => toggleReplies(comment.id)} className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1.5">
                {childLoading[comment.id] ? <Loader2 size={12} className="animate-spin" /> :
                  showReplies[comment.id] ? "Ẩn phản hồi" : `Xem ${comment.replyCount || directChildren.length} phản hồi`}
              </button>
              {showReplies[comment.id] && (
                <div className="border-l-2 border-slate-100 mt-2 pl-3 ml-1">
                  {directChildren.map((child) => renderComment(child, true))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600" />
    </div>
  );
  if (!post) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar user={currentUser} />

      <main className="flex-1 w-full flex flex-col items-center py-10 px-4">
        {/* Header Bar */}
        <div className="w-full max-w-[760px] mb-6 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-xs font-bold uppercase transition-colors">
            <ArrowLeft size={14} /> Quay lại
          </button>

          {user?.username === post.authorName && (
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-white rounded-full text-slate-400 border border-transparent hover:border-slate-200 shadow-sm transition-all">
                <MoreHorizontal size={18} />
              </button>
              <AnimatePresence>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 shadow-2xl rounded-2xl z-20 py-2 overflow-hidden"
                    >
                      <MenuBtn onClick={() => navigate(`/edit-post/${post.id}`)} icon={<PencilLine size={16} className="text-blue-500" />} label="Chỉnh sửa bài viết" />
                      <div className="border-t border-slate-100 my-1" />
                      <MenuBtn onClick={() => handleToggleStatus("POST")} icon={post.enabled ? <Lock size={16} /> : <Unlock size={16} />} label={post.enabled ? "Ẩn bài viết" : "Hiện bài viết"} />
                      <MenuBtn onClick={() => handleToggleStatus("COMMENT")} icon={post.commentEnabled ? <MessageCircleOff size={16} /> : <MessageCircle size={16} />} label={post.commentEnabled ? "Tắt bình luận" : "Bật bình luận"} />
                      <MenuBtn onClick={() => handleToggleStatus("REACT")} icon={post.reactionEnabled ? <HeartOff size={16} /> : <Heart size={16} />} label={post.reactionEnabled ? "Tắt tương tác" : "Bật tương tác"} />
                      <div className="border-t border-slate-100 my-1" />
                      <MenuBtn onClick={handleDelete} icon={<Trash2 size={16} className="text-red-500" />} label="Xóa bài viết" />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className={`relative bg-white w-full max-w-[760px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border rounded-3xl overflow-hidden flex flex-col transition-all ${!post.enabled ? "border-slate-300 opacity-75" : "border-slate-200"}`}>
          {!post.enabled && (
            <div className="absolute inset-0 z-20 bg-slate-900/10 backdrop-blur-[1px] flex flex-col items-center justify-center pointer-events-none">
              <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl px-6 py-4 flex items-center gap-3 shadow-lg">
                <Lock size={18} className="text-slate-500 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-700">Bài viết đang bị ẩn</p>
                  <p className="text-xs text-slate-400">Chỉ bạn mới thấy nội dung này</p>
                </div>
              </div>
            </div>
          )}
          <div className="px-8 pt-8 article-content">
            <div className="flex items-center gap-3 mb-6">
              <img src={`https://ui-avatars.com/api/?name=${post.authorName}&background=random`} className="h-10 w-10 rounded-full border border-slate-100 shadow-sm" alt="avatar" />
              <div>
                <p className="text-sm font-bold text-slate-800 leading-none mb-1">{post.authorName}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                  {new Date(post.createdAt).toLocaleDateString("vi-VN")} · <span className="text-blue-600">{post.categoryName}</span>
                </p>
              </div>
            </div>
            <div className="main-title" dangerouslySetInnerHTML={{ __html: post.title }} />
          </div>

          <div className="px-8 py-6 article-render">
            <div className="article-body" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Interaction Bar (Post) */}
          <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-4 flex-wrap">
            {post.reactionEnabled ? (
              <div className="flex items-center gap-4">
                <button onClick={() => handleReact("LIKE")} className={`flex items-center gap-1.5 text-sm font-bold transition-all ${post.userLiked ? "text-blue-600 scale-110" : "text-slate-400 hover:text-blue-600"}`}>
                  <ThumbsUp size={17} className={post.userLiked ? "fill-current" : ""} /> {post.likeCount}
                </button>
                <button onClick={() => handleReact("DISLIKE")} className={`flex items-center gap-1.5 text-sm font-bold transition-all ${post.userDisliked ? "text-red-500 scale-110" : "text-slate-400 hover:text-red-500"}`}>
                  <ThumbsDown size={17} className={post.userDisliked ? "fill-current" : ""} /> {post.dislikeCount}
                </button>
                <div className="w-px h-4 bg-slate-200" />
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <button key={s} onMouseEnter={() => setHoverStar(s)} onMouseLeave={() => setHoverStar(0)} onClick={() => handleRate(s)} className="p-0.5 transition-transform hover:scale-125">
                      <Star size={15} className={(hoverStar || post.userRating || 0) >= s ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-500 ml-1.5">{post.ratingAvg?.toFixed(1) || "0.0"}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                <HeartOff size={13} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-400">Tương tác đã bị tắt</span>
              </div>
            )}

            <div className="ml-auto">
              {post.commentEnabled ? (
                <button
                  onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                  className={`flex items-center gap-2 text-sm font-bold transition-all px-4 py-2 rounded-xl ${isCommentsOpen ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:bg-slate-100"}`}
                >
                  <MessageSquare size={17} className={isCommentsOpen ? "fill-current" : ""} />
                  {post.commentCount} Bình luận
                  <motion.div animate={{ rotate: isCommentsOpen ? 180 : 0 }}><ChevronDown size={13} /></motion.div>
                </button>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                  <MessageCircleOff size={13} className="text-slate-400" />
                  <span className="text-xs font-semibold text-slate-400">Bình luận đã bị tắt</span>
                </div>
              )}
            </div>
          </div>

          {/* Comment Section */}
          <AnimatePresence>
            {isCommentsOpen && post.commentEnabled && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-slate-100 bg-slate-50/30"
              >
                <div className="max-h-[500px] overflow-y-auto px-8 py-4 scrollbar-thin scrollbar-thumb-slate-200">
                  {commentsLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-200" /></div>
                  ) : comments.length === 0 ? (
                    <p className="text-center text-slate-400 text-sm italic py-10">Chưa có thảo luận nào.</p>
                  ) : (
                    <div className="pb-4">
                      {comments.filter((c) => !c.parentId).map((root) => renderComment(root, false))}
                      <div ref={commentsEndRef} />
                    </div>
                  )}
                </div>

                <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                  <div className="max-w-3xl mx-auto">
                    <AnimatePresence>
                      {replyingTo && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                          className="flex items-center justify-between px-3 py-1.5 bg-blue-50 rounded-lg text-[10px] font-bold text-blue-600 mb-2 uppercase tracking-wider"
                        >
                          <span>Phản hồi <b>{replyingTo.authorName}</b></span>
                          <button onClick={() => setReplyingTo(null)} className="hover:text-red-500 transition-colors"><X size={14} /></button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                      <input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
                        placeholder={replyingTo ? `Trả lời ${replyingTo.authorName}...` : "Chia sẻ suy nghĩ của bạn..."}
                        className="flex-1 bg-transparent border-none px-4 text-sm outline-none placeholder:text-slate-400"
                      />
                      <button onClick={handleSendComment} disabled={!commentText.trim()} className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:bg-slate-300 shadow-md active:scale-95 transition-all flex-shrink-0">
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />

      <style>{`
        .main-title h1 { font-size: 2.25rem; font-weight: 800; line-height: 1.25; color: #0f172a; margin-bottom: 0.5rem; letter-spacing: -0.02em; }
        .article-body { font-size: 1.125rem; line-height: 1.8; color: #334155; }
        .article-body p { margin-bottom: 1.5rem; }
        .article-body img { border-radius: 16px; margin: 2rem 0; box-shadow: 0 4px 25px rgba(0,0,0,0.08); border: 1px solid #f1f5f9; }
        .scrollbar-thin::-webkit-scrollbar { width: 5px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

const MenuBtn = ({ onClick, icon, label }: { onClick: () => void; icon: any; label: string }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className="w-full flex items-center gap-4 px-5 py-3 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all group font-bold"
  >
    <span className="text-slate-400 group-hover:text-blue-500 transition-colors">{icon}</span> {label}
  </button>
);

export default PostDetailPage;