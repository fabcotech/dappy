const paste = [
  'Paste',
  (div: HTMLDivElement, selected: string, target: HTMLTextAreaElement) => {
    navigator.clipboard.readText().then(function (t) {
      const val = target.value;
      const selectionStart = target.selectionStart;
      target.value = val.slice(0, selectionStart) + t + val.slice(selectionStart);
    });
    div.remove();
  },
];
const copy = [
  'Copy',
  (div: HTMLDivElement, selected: string, target: any) => {
    navigator.clipboard.writeText(selected);
    div.remove();
  },
];
const cut = [
  'Cut',
  (div: HTMLDivElement, selected: string, target: any) => {
    div.remove();
  },
];
const openDevTools = [
  'Toggle dev tools',
  (div: HTMLDivElement, doc: any) => {
    div.remove();
  },
];

export const contextMenu = (document: any) => {
  document.addEventListener('contextmenu', (e: any) => {
    let operations: any = [];
    const selected = window.getSelection() && window.getSelection().toString();
    if (selected) {
      operations = [copy];
    }
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
      operations = operations.concat([paste]);
    }
    if (operations.length === 0) {
      return;
    }
    const div = document.createElement('div');
    div.className = 'context-menu';
    div.style.width = '160px';
    div.style.color = '#fff';
    div.style.backgroundColor = 'rgba(04, 04, 04, 0.8)';
    div.style.top = e.clientY - 5 + 'px';
    div.style.left = e.clientX - 5 + 'px';
    div.style.position = 'absolute';
    div.style.zIndex = 10;
    div.style.fontSize = '16px';
    div.style.borderRadius = '2px';
    div.style.fontFamily = 'fira';
    div.addEventListener('mouseleave', () => {
      div.remove();
    });
    operations.forEach((o: any) => {
      const d = document.createElement('div');
      d.style.padding = '6px';
      d.style.cursor = 'pointer';
      d.style.borderBottom = '1px solid #aaa';
      d.addEventListener('mouseenter', () => {
        console.log('onmouseenter');
        d.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        d.style.color = '#fff';
      });
      d.addEventListener('mouseleave', () => {
        console.log('onmouseleave');
        d.style.backgroundColor = 'transparent';
        d.style.color = '#fff';
      });
      d.innerText = o[0];
      d.addEventListener('click', () => (o[1] as (a: any, b: any, c: any) => void)(div, selected, e.target));
      div.appendChild(d);
    });
    document.body.appendChild(div);
  });
};
