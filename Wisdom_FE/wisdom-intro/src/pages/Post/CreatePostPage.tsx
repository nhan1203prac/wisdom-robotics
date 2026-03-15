import { useRef, useState, useEffect } from "react";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Link } from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { ArrowLeft, Send, Loader2, Tag } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import postApi from "@/service/api/post.api";
import categoryApi from "@/service/api/category.api";
import type { Category } from "@/types/category.type";

import { CustomBulletList, CustomOrderedList, CustomListItem } from "./extensions/CustomListExtensions";
import { ResizableImage } from "./extensions/ResizableImage";
import EditorToolbar from "./components/editor/EditorToolbar";
import TableOverlay from "./components/editor/TableOverlay";
import "./styles/editorStyles.css"
import "./styles/article-content.css"

export default function CreatePostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false, orderedList: false, listItem: false,
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        showOnlyCurrent: false,
        placeholder: ({ node, editor, pos }) => {
          if (node.type.name === "heading" && node.attrs.level === 1)
            return "Tieu de bai viet...";
          if (node.type.name === "paragraph") {
            const doc = editor.state.doc;
            let firstParaPos = -1;
            doc.forEach((child, offset) => {
              if (firstParaPos === -1 && child.type.name === "paragraph")
                firstParaPos = offset;
            });
            if (pos === firstParaPos) return "Bat dau viet noi dung...";
          }
          return "";
        },
      }),
      CustomBulletList, CustomOrderedList, CustomListItem,
      Underline, TextStyle, Color,
      ResizableImage,
      Table.configure({ resizable: true }),
      TableRow, TableHeader, TableCell,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({
        types: ["heading", "paragraph", "listItem"],
        alignments: ["left", "center", "right"],
      }),
    ],
    content: `<h1></h1><p></p>`,
    editorProps: { attributes: { class: "editor-canvas article-content" } },
  });

  const s = useEditorState({
    editor,
    selector: (ctx) => {
      const e = ctx.editor;
      if (!e) return null;
      const { $from } = e.state.selection;
      const currentAlign = $from.node().attrs?.textAlign ?? null;
      return {
        bold: e.isActive("bold"),
        italic: e.isActive("italic"),
        underline: e.isActive("underline"),
        heading: e.isActive("heading"),
        bulletList: e.isActive("bulletList"),
        orderedList: e.isActive("orderedList"),
        link: e.isActive("link"),
        table: e.isActive("table"),
        alignLeft: currentAlign === "left",
        alignCenter: currentAlign === "center",
        alignRight: currentAlign === "right",
      };
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = (await categoryApi.getAll()) as any;
        if (res.data.success) setCategories(res.data.data);
      } catch (err) { console.error(err); }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditMode && editor) {
      const loadPost = async () => {
        setIsFetching(true);
        try {
          const res = (await postApi.getById(id)) as any;
          if (res.data.success) {
            const post = res.data.data;
            editor.commands.setContent(`${post.title}${post.content}`);
            if (post.categoryId) setSelectedCategoryId(post.categoryId);
          }
        } catch {
          alert("Khong tim thay bai viet!");
          navigate("/home");
        } finally { setIsFetching(false); }
      };
      loadPost();
    }
  }, [id, editor, isEditMode, navigate]);

  if (!editor || !s) return null;

  /* ── Handlers ── */
  const handleLinkClick = () => {
    if (editor.isActive("link")) { editor.chain().focus().unsetLink().run(); return; }
    const { from, to, empty } = editor.state.selection;
    if (empty) {
      const url = window.prompt("Nhap URL:");
      if (url) editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
    } else {
      const text = editor.state.doc.textBetween(from, to, " ").trim();
      const href = text.startsWith("http") ? text : `https://${text}`;
      editor.chain().focus().setLink({ href, target: "_blank" }).run();
    }
  };

  const insertImageFromFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      editor.chain().focus().setImage({ src, width: 320, float: "left" } as any).run();
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    insertImageFromFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    e.preventDefault();
    insertImageFromFile(file);
  };

  const applyAlign = (align: "left" | "center" | "right") => {
    const { selection, schema } = editor.state;
    const selectedNode = (selection as any).node;
    if (selectedNode && selectedNode.type === schema.nodes.image) {
      const floatVal = align === "center" ? "none" : align;
      editor.chain().focus().updateAttributes("image", { float: floatVal }).run();
      return;
    }
    editor.chain().focus().setTextAlign(align).run();
  };

  const handlePublish = async () => {
    if (!selectedCategoryId) return alert("Vui long chon danh muc!");
    if (!editor.getText().trim()) return alert("Noi dung khong duoc de trong!");
    setIsSubmitting(true);
    const fullHtml = editor.getHTML();
    const json = editor.getJSON();
    const nodes = json.content || [];
    let titleHtml = "<h1></h1>";
    let contentHtml = fullHtml;
    if (nodes[0]?.type === "heading" && nodes[0].attrs?.level === 1) {
      const h1Match = fullHtml.match(/<h1[^>]*>.*?<\/h1>/i);
      titleHtml = h1Match ? h1Match[0] : "<h1></h1>";
      contentHtml = fullHtml.replace(/<h1[^>]*>.*?<\/h1>/i, "").trim();
    }
    try {
      const payload = { title: titleHtml, content: contentHtml, categoryId: Number(selectedCategoryId) };
      const response = isEditMode
        ? await postApi.update(id, payload)
        : await postApi.create(payload);
      if (response.data.success) { alert("Thanh cong!"); navigate("/home"); }
    } catch { alert("Co loi xay ra!"); }
    finally { setIsSubmitting(false); }
  };

  if (isFetching) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      <p className="text-slate-500 font-medium italic">Dang tai du lieu...</p>
    </div>
  );

  return (
    <div className="page-container">
      {/* Header */}
      <div className="header-bar">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="icon-btn-circle">
            <ArrowLeft size={20} />
          </button>
          <div className="category-box">
            <Tag size={16} className="text-blue-500" />
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value as any)}
              className="category-select"
            >
              <option value="" disabled>Phan loai bai viet...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
        <button className="publish-btn" onClick={handlePublish} disabled={isSubmitting}>
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          {isEditMode ? "Luu thay doi" : "Dang bai"}
        </button>
      </div>

      {/* Toolbar */}
      <EditorToolbar
        editor={editor}
        s={s}
        fileRef={fileRef}
        onAlign={applyAlign}
        onLinkClick={handleLinkClick}
      />

      {/* Editor paper */}
      <div className="paper" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        <input type="file" ref={fileRef} onChange={uploadImage} accept="image/*" hidden />
        <EditorContent editor={editor} />
      </div>

      {/* Word-style table overlay */}
      <TableOverlay editor={editor} />

      {/* <style>{editorStyles}</style> */}
    </div>
  );
}