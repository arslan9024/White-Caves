const fs = require('fs');
const path = './src/components/navigation/Sidebar108/styles/Sidebar108.style.ts';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(
  'export const SidebarContainer = styled.aside<{ $isCollapsed: boolean; $isDark: boolean }>',
  'export const SidebarContainer = styled.aside<{ $isCollapsed: boolean; $isDark: boolean; $sidebarWidth?: number }>'
);
content = content.replace(
  'width: ${({ $isCollapsed }) => ($isCollapsed ? \'72px\' : \'280px\')};',
  'width: ${({ $isCollapsed, $sidebarWidth }) => ($isCollapsed ? \'72px\' : $sidebarWidth ? \${$sidebarWidth}px\ : \'280px\')};'
);
content += \nexport const DragHandle = styled.div\\\
  position: absolute;
  top: 0;
  right: 0;
  width: 5px;
  height: 100%;
  cursor: col-resize;
  background-color: transparent;
  z-index: 1000;
  &:hover {
    background-color: rgba(239, 68, 68, 0.5);
  }
\\\;\n;
fs.writeFileSync(path, content);
