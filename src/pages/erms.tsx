import fs from 'fs';
import path from 'path';
import React from 'react';
import ERMSDiagramViewer from '../components/ERMSDiagramViewer';

/**
 * Extract Mermaid diagram blocks from a markdown string.
 */
function extractDiagrams(md: string): string[] {
  const regex = /```mermaid\s+([\s\S]*?)```/g;
  const diagrams: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(md)) !== null) {
    diagrams.push(match[1].trim());
  }
  return diagrams;
}

type Props = {
  markdown: string;
};

const ERMSPage: React.FC<Props> = ({ markdown }) => {
  const diagrams = extractDiagrams(markdown);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Entity‑Relationship Management System (ERMS)</h1>
      {diagrams.map((d, i) => (
        <section key={i} style={{ marginBottom: '3rem' }}>
          <ERMSDiagramViewer diagram={d} />
        </section>
      ))}
    </div>
  );
};

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), '.agents', 'docs', 'ERMS_OVERVIEW.md');
  const markdown = fs.readFileSync(filePath, 'utf8');
  return { props: { markdown } };
}

export default ERMSPage;
