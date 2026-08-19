/** DocumentVersionHistory.tsx — View Layer */
import React, { FC } from 'react';
import { useDocumentVersionHistoryLogic } from './logic/DocumentVersionHistory.logic';
import { Root, Sidebar, SidebarTitle, VersionItem, VersionTag, VersionMeta, CurrentBadge, Content, DiffTitle, ChangesBox, AuthorRow } from './styles/DocumentVersionHistory.style';

export const DocumentVersionHistory: FC = () => {
  const { VERSIONS, selectedVersion, setSelectedVersion, selected } = useDocumentVersionHistoryLogic();
  return (
    <Root data-testid="document-version-history">
      <Sidebar>
        <SidebarTitle>Versions</SidebarTitle>
        {VERSIONS.map((v) => (
          <VersionItem key={v.id} $selected={selectedVersion === v.id} $current={v.isCurrent} onClick={() => setSelectedVersion(v.id)}>
            <VersionTag $current={v.isCurrent}>{v.version}{v.isCurrent && <CurrentBadge>Current</CurrentBadge>}</VersionTag>
            <VersionMeta>{v.author}</VersionMeta>
          </VersionItem>
        ))}
      </Sidebar>
      <Content>
        <DiffTitle>Changes in {selected.version}</DiffTitle>
        <ChangesBox>✚ {selected.changes}</ChangesBox>
        <AuthorRow>Modified by <strong>{selected.author}</strong> on {selected.timestamp}</AuthorRow>
      </Content>
    </Root>
  );
};
export default DocumentVersionHistory;
