import { useEffect, type FC } from 'react';

interface StructuredDataProps {
  id: string;
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

const StructuredData: FC<StructuredDataProps> = ({ id, data }) => {
  useEffect(() => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    const payload = JSON.stringify(data);

    if (existing) {
      existing.textContent = payload;
      return;
    }

    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = payload;
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [id, data]);

  return null;
};

export default StructuredData;
