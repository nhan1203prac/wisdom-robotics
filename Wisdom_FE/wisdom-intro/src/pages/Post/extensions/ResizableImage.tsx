import React, { useRef, useState } from "react";
import { Image } from "@tiptap/extension-image";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

function ResizableImageComponent({ node, updateAttributes, selected }: any) {
  const [isResizing, setIsResizing] = useState(false);
  const startX = useRef(0);
  const startW = useRef(0);
  const imgRef = useRef<HTMLImageElement>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startX.current = e.clientX;
    startW.current = imgRef.current?.offsetWidth || 300;
    const onMove = (ev: MouseEvent) => {
      const newW = Math.max(80, startW.current + (ev.clientX - startX.current));
      updateAttributes({ width: newW });
    };
    const onUp = () => {
      setIsResizing(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const width = node.attrs.width || 320;
  const floatDir = node.attrs.float || "left";

  const wrapperStyle: React.CSSProperties =
    floatDir === "none"
      ? { display: "block", width, margin: "12px auto", position: "relative", lineHeight: 0 }
      : floatDir === "right"
      ? { float: "right", width, position: "relative", display: "block", margin: "4px 0 16px 20px", lineHeight: 0 }
      : { float: "left", width, position: "relative", display: "block", margin: "4px 20px 16px 0", lineHeight: 0 };

  return (
    <NodeViewWrapper as="div" style={{ ...wrapperStyle, cursor: isResizing ? "nwse-resize" : "default" }}>
      <img
        ref={imgRef}
        src={node.attrs.src}
        alt={node.attrs.alt || ""}
        style={{
          width: "100%",
          display: "block",
          borderRadius: 8,
          outline: selected ? "2px solid #1132D4" : "none",
          userSelect: "none",
        }}
        draggable={false}
      />
      {selected && (
        <span
          onMouseDown={onMouseDown}
          style={{
            position: "absolute", right: -6, bottom: -6,
            width: 14, height: 14, background: "#1132D4",
            borderRadius: "50%", cursor: "nwse-resize",
            border: "2px solid white",
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
            zIndex: 10, display: "block",
          }}
        />
      )}
    </NodeViewWrapper>
  );
}

/* Tiptap Extension */
export const ResizableImage = Image.extend({
  inline: false,
  group: "block",
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: 320,
        parseHTML: (el) => el.getAttribute("width") || 320,
        renderHTML: (attrs) => ({ width: attrs.width }),
      },
      float: {
        default: "left",
        parseHTML: (el) => el.getAttribute("data-float") || "left",
        renderHTML: (attrs) => ({ "data-float": attrs.float }),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
}).configure({ allowBase64: true });