import { Menu, MenuItem } from 'electron';

// todo shortcuts don't work on linux/ubuntu
const itemZoomIn = new MenuItem({
  label: 'Zoom in',
  /* accelerator: 'CommandOrControl+Up', */
  role: 'zoomIn',
});
const itemZoomOut = new MenuItem({
  label: 'Zoom out',
  /* accelerator: 'CommandOrControl+Down', */
  role: 'zoomOut',
});
const itemZoomReset = new MenuItem({
  label: 'Reset zoom',
  //accelerator: 'CommandOrControl+=',
  role: 'resetZoom',
});
const itemToggleDevTools = new MenuItem({
  label: 'Toggle dev tools',
  //accelerator: 'CommandOrControl+I',
  role: 'toggleDevTools',
});

const itemCopy = new MenuItem({
  label: 'Copy',
  accelerator: 'CommandOrControl+C',
  role: 'copy',
});
const itemSelectAll = new MenuItem({
  label: 'Select All',
  accelerator: 'CommandOrControl+A',
  role: 'selectAll',
});
const itemPaste = new MenuItem({
  label: 'Paste',
  accelerator: 'CommandOrControl+V',
  role: 'paste',
});

const menu = new Menu();
menu.append(itemCopy);
menu.append(itemPaste);
menu.append(itemSelectAll);
menu.append(itemZoomIn);
menu.append(itemZoomOut);
menu.append(itemZoomReset);
menu.append(itemToggleDevTools);

export const getMenu = () => {
  return menu;
};
