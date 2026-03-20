import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import postApi from '@/service/api/post.api';
import categoryApi from '@/service/api/category.api';
import PostCard from './components/PostCard';
import type { Post } from '@/types/post.type';
import type { Category } from '@/types/category.type';
import type { UserResponse } from '@/types/user.type';
import { Loader2, PlusCircle, ChevronDown, Filter, LayoutGrid } from 'lucide-react';

const PostPage = ({ currentUser }: { currentUser: UserResponse }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | string>("");
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 9;

  useEffect(() => {
    categoryApi.getAll().then((res: any) => {
      if (res.data.success) setCategories(res.data.data);
    }).catch(console.error);
  }, []);

  const fetchPosts = useCallback(async (page: number, isLoadMore = false, catId?: number | string) => {
    isLoadMore ? setFetchingMore(true) : setLoading(true);
    try {
      const params = { page, size: pageSize, ...(catId ? { categoryId: catId } : {}) };
      const res = await postApi.getAll(params);
      const data = (res as any).data;
      if (data.success) {
        setPosts(prev => isLoadMore ? [...prev, ...data.data.content] : data.data.content);
        setTotalPages(data.data.totalPages);
        setCurrentPage(data.data.page);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); setFetchingMore(false); }
  }, []);

  useEffect(() => {
    setCurrentPage(0);
    fetchPosts(0, false, selectedCategory);
  }, [selectedCategory, fetchPosts]);

  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 150)
        if (!fetchingMore && !loading && currentPage < totalPages - 1)
          fetchPosts(currentPage + 1, true, selectedCategory);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [currentPage, totalPages, fetchingMore, loading, fetchPosts, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Navbar user={currentUser} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">

        {/* Create bar */}
        <div
          onClick={() => navigate('/create-post')}
          className="bg-white rounded-xl border border-slate-200 p-4 mb-10 cursor-pointer hover:border-blue-300 transition-all flex items-center gap-4 group"
        >
          <img
            src={`https://ui-avatars.com/api/?name=${currentUser?.username}&background=random`}
            className="h-10 w-10 rounded-full border border-slate-100 shrink-0"
            alt="avatar"
          />
          <div className="flex-1 bg-slate-50 rounded-lg px-4 py-2 text-sm text-slate-500">
            Bạn muốn chia sẻ điều gì hôm nay, {currentUser?.username}?
          </div>
          <div className="bg-blue-600 text-white p-2 rounded-lg shadow-sm group-hover:bg-blue-700 transition-colors">
            <PlusCircle size={20} />
          </div>
        </div>

        {/* Filter & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-2">
            <LayoutGrid className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold">Khám phá tin tức</h1>
          </div>
          
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white border border-slate-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center py-40 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="text-slate-500 text-sm">Đang tải bài viết...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center py-24 gap-4 bg-white rounded-2xl border border-dashed border-slate-200">
            <Filter size={48} className="text-slate-200" />
            <p className="text-slate-500 font-medium">Chưa có bài viết nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <PostCard key={`${post.id}-${i}`} post={post} />
            ))}
          </div>
        )}

        {/* Pagination Loading */}
        {fetchingMore && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        )}

        {!fetchingMore && !loading && currentPage >= totalPages - 1 && posts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-400">
              Bạn đã xem hết tất cả bài viết.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PostPage;