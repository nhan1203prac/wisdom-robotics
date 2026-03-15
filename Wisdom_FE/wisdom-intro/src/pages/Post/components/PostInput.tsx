// import React, { useState, useRef } from 'react'
// import { motion, AnimatePresence } from "framer-motion";
// import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type, FileText } from 'lucide-react';
// import postApi from '@/service/api/post.api';
// import { useAuth } from '@/context/AuthContext';

// const PostInput = ({ onPostCreated }) => {
//   const [isExpanding, setIsExpanding] = useState(false);
//   const titleRef = useRef<HTMLDivElement>(null);
//   const contentRef = useRef<HTMLDivElement>(null);


//   const {user} = useAuth()
  
//   const applyStyle = (command: string) => {
//     document.execCommand(command, false);
//   };

//   const handlePost = async () => {
//     const titleHtml = titleRef.current?.innerHTML || '';
//     const contentHtml = contentRef.current?.innerHTML || '';
    
//     if (!titleRef.current?.innerText.trim() && !contentRef.current?.innerText.trim()) {
//         alert("Vui lòng nhập tiêu đề hoặc nội dung!");
//         return;
//     }

//     try {
//       const response = (await postApi.create({ 
//         title: titleHtml, 
//         content: contentHtml 
//       })) as any;

//       if (response.data.success) {
//         onPostCreated(response.data.data);
//         handleCancel();
//       }
//     } catch (err) { 
//       alert("Đăng bài thất bại!"); 
//     }
//   };

//   const handleCancel = () => {
//     if (titleRef.current) titleRef.current.innerHTML = '';
//     if (contentRef.current) contentRef.current.innerHTML = ''; 
//     setIsExpanding(false);
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-6 transition-all duration-300">
      
//       {/* 1. THANH CÔNG CỤ */}
//       <AnimatePresence>
//         {isExpanding && (
//           <motion.div 
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: 'auto', opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-100 sticky top-0 z-10"
//           >
//             <div className="flex gap-0.5 border-r border-slate-200 pr-2 mr-2">
//               <ToolbarButton onClick={() => applyStyle('bold')} icon={<Bold size={16} />} title="In đậm" />
//               <ToolbarButton onClick={() => applyStyle('italic')} icon={<Italic size={16} />} title="In nghiêng" />
//               <ToolbarButton onClick={() => applyStyle('underline')} icon={<Underline size={16} />} title="Gạch chân" />
//             </div>
//             <div className="flex gap-0.5">
//               <ToolbarButton onClick={() => applyStyle('justifyLeft')} icon={<AlignLeft size={16} />} title="Căn trái" />
//               <ToolbarButton onClick={() => applyStyle('justifyCenter')} icon={<AlignCenter size={16} />} title="Căn giữa" />
//               <ToolbarButton onClick={() => applyStyle('justifyRight')} icon={<AlignRight size={16} />} title="Căn phải" />
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className="p-5">
//         <div className="flex items-start gap-4">
//           <img 
//             src={`https://ui-avatars.com/api/?name=${user?.username}&background=random`}
//             className="h-10 w-10 rounded-full border shadow-sm mt-1" 
//             alt="avatar"
//           />
          
//           <div className="flex-1 space-y-4">
//             {/* 2. Ô NHẬP TIÊU ĐỀ */}
//             <div className={`${isExpanding ? 'block' : 'hidden'}`}>
//               <div className="flex items-center gap-2 mb-1 text-slate-400">
//                 <Type size={14} />
//                 <span className="text-[10px] font-bold uppercase ">Tiêu đề bài viết</span>
//               </div>
//               <div 
//                 ref={titleRef}
//                 contentEditable
//                 onFocus={() => setIsExpanding(true)}
//                 className="w-full text-xl font-bold outline-none text-slate-900 empty:before:content-[attr(data-placeholder)] empty:before:text-slate-300"
//                 data-placeholder="Tiêu đề ..."
//               />
//               <div className="h-[1px] bg-slate-100 w-full mt-2" />
//             </div>

//             {/* 3. Ô NHẬP NỘI DUNG */}
//             <div>
//               {isExpanding && (
//                 <div className="flex items-center gap-2 mb-1 text-slate-400">
//                   <FileText size={14} />
//                   <span className="text-[10px] font-bold uppercase ">Nội dung chi tiết</span>
//                 </div>
//               )}
//               <div 
//                 ref={contentRef}
//                 contentEditable
//                 onFocus={() => setIsExpanding(true)}
//                 className={`w-full text-slate-700 outline-none leading-relaxed transition-all ${
//                   isExpanding ? 'min-h-[120px] text-base' : 'min-h-[40px] flex items-center text-sm'
//                 } empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400`}
//                 data-placeholder="Bạn đang nghĩ gì?"
//               />
//             </div>
            
//             {/* 4. NÚT ĐIỀU KHIỂN */}
//             {isExpanding && (
//               <motion.div 
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="flex justify-end items-center gap-3 pt-3 border-t border-slate-100"
//               >
//                 <button onClick={handleCancel} className="text-slate-400 text-sm font-semibold hover:text-slate-600 px-2">Hủy</button>
//                 <button 
//                   onClick={handlePost} 
//                   className="bg-[#1132D4] text-white px-8 py-2 rounded-full text-sm font-bold shadow-md hover:bg-blue-700 transition-all active:scale-95"
//                 >
//                   Đăng bài
//                 </button>
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </div>

//       <style jsx global>{`
//         [contenteditable] b, [contenteditable] strong { font-weight: bold; }
//         [contenteditable] i, [contenteditable] em { font-style: italic; }
//         [contenteditable] u { text-decoration: underline; }
//         [contenteditable] div[style*="text-align: center"] { text-align: center; }
//         [contenteditable] div[style*="text-align: right"] { text-align: right; }
//       `}</style>
//     </div>
//   );
// };

// const ToolbarButton = ({ onClick, icon, title }) => (
//   <button 
//     onMouseDown={(e) => {
//       e.preventDefault(); //Ngăn nút bấm làm mất focus của ô đang nhập
//       onClick();
//     }}
//     className="p-2 text-slate-500 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all"
//     title={title}
//   >
//     {icon}
//   </button>
// );

// export default PostInput;