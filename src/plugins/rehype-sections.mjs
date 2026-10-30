// Prepares part and recipe bodies for the numbered-card layout. Only applies to files under
// content/parts and content/recipes, never to the contribution guides or other docs.
//   - wraps each "## Heading" and the content that follows it in <section class="cd-section"> (a numbered card)
//   - wraps Markdown tables in a scrolling frame and gives them the site's table style
//   - turns blockquotes (lines starting with ">") into note callouts
function isTable(node) {
  return node.type === 'element' && node.tagName === 'table';
}

function styleTable(table) {
  table.properties = { ...table.properties, className: ['cd-table'] };
  return { type: 'element', tagName: 'div', properties: { className: ['cd-table-wrap'] }, children: [table] };
}

function toNote(node) {
  return { ...node, tagName: 'div', properties: { className: ['cd-note'] } };
}

export default function rehypeSections() {
  return (tree, file) => {
    const path = String(file?.path ?? file?.history?.[0] ?? '');
    if (!/[\\/]content[\\/](parts|recipes)[\\/]/.test(path)) return;
    const out = [];
    let current = null;
    for (const raw of tree.children) {
      const node = isTable(raw) ? styleTable(raw) : raw.type === 'element' && raw.tagName === 'blockquote' ? toNote(raw) : raw;
      if (node.type === 'element' && node.tagName === 'h2') {
        current = { type: 'element', tagName: 'section', properties: { className: ['cd-section'] }, children: [node] };
        out.push(current);
      } else if (current) {
        current.children.push(node);
      } else {
        out.push(node);
      }
    }
    tree.children = out;
  };
}
