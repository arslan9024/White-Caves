import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

/**
 * ERMSDiagramViewer
 * -----------------
 * Renders any Mermaid diagram string into an SVG.
 * Usage:
 *   <ERMSDiagramViewer diagram={`graph TD; A-->B;`} />
 * The component initializes Mermaid (once) and then renders the diagram
 * into an inner <div>. It works in any React app (Vite, CRA, Next.js, etc.).
 */
const ERMSDiagramViewer: React.FC<{ diagram: string }> = ({ diagram }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialise mermaid only once
    mermaid.initialize({ startOnLoad: false, theme: 'default' });
    if (containerRef.current) {
      // Render the diagram into the container
      mermaid.render('generatedDiagram', diagram, (svgCode) => {
        containerRef.current!.innerHTML = svgCode;
      });
    }
  }, [diagram]);

  return <div ref={containerRef} />;
};

export default ERMSDiagramViewer;

