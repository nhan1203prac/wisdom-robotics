import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";

export const CustomListItem = ListItem.extend({
  content: "paragraph | heading block*",
  addAttributes() {
    return {
      ...this.parent?.(),
      color: {
        default: null,
        parseHTML: (el) => el.style.color || null,
        renderHTML: (attrs) => (attrs.color ? { style: `color: ${attrs.color}` } : {}),
      },
    };
  },
});

export const CustomBulletList = BulletList.extend({
  addAttributes() {
    return {
      listStyle: {
        default: "disc",
        parseHTML: (el) => el.style.listStyleType || "disc",
        renderHTML: (attrs) => ({ style: `list-style-type:${attrs.listStyle};` }),
      },
    };
  },
});

export const CustomOrderedList = OrderedList.extend({
  addAttributes() {
    return {
      listStyle: {
        default: "decimal",
        parseHTML: (el) => el.style.listStyleType || "decimal",
        renderHTML: (attrs) => ({ style: `list-style-type:${attrs.listStyle};` }),
      },
    };
  },
});