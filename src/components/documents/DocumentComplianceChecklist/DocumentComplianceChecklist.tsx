/** DocumentComplianceChecklist.tsx — View Layer */
import React, { FC } from 'react';
import { useDocumentComplianceChecklistLogic } from './logic/DocumentComplianceChecklist.logic';
import { Root, Header, Title, Score, Group, GroupTitle, Item, CheckIcon, ItemText, ItemLabel, ItemNote } from './styles/DocumentComplianceChecklist.style';

function groupBy<T extends { category: string }>(arr: T[]) {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});
}

export const DocumentComplianceChecklist: FC = () => {
  const { items, toggle, passCount, failCount, pct } = useDocumentComplianceChecklistLogic();
  const grouped = groupBy(items);
  return (
    <Root data-testid="document-compliance-checklist">
      <Header>
        <Title>🔍 RERA Compliance Checklist</Title>
        <Score $ok={failCount === 0}>{passCount}/{items.length} ({pct}%) {failCount > 0 ? `— ${failCount} missing` : '✅ All clear'}</Score>
      </Header>
      {Object.entries(grouped).map(([cat, catItems]) => (
        <Group key={cat}>
          <GroupTitle>{cat}</GroupTitle>
          {catItems.map((item) => (
            <Item key={item.id} onClick={() => toggle(item.id)}>
              <CheckIcon $ok={item.present}>{item.present ? '✓' : '✗'}</CheckIcon>
              <ItemText>
                <ItemLabel $ok={item.present}>{item.field}{item.required && ' *'}</ItemLabel>
                {!item.present && item.note && <ItemNote>⚠ {item.note}</ItemNote>}
              </ItemText>
            </Item>
          ))}
        </Group>
      ))}
    </Root>
  );
};
export default DocumentComplianceChecklist;
