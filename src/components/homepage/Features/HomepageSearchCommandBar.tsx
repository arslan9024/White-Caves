import React, { FC, useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;
const glow = keyframes`0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,0)}50%{box-shadow:0 0 0 6px rgba(59,130,246,0.15)}`;

const Wrap = styled.div`position:relative;font-family:'Inter',sans-serif;max-width:680px;margin:0 auto`;

const SearchBar = styled.div<{$focused:boolean}>`
  display:flex;align-items:center;gap:12px;padding:14px 20px;border-radius:18px;
  background:rgba(15,23,42,0.95);backdrop-filter:blur(24px);
  border:2px solid ${p=>p.$focused?'rgba(59,130,246,0.6)':'rgba(100,116,139,0.2)'};
  transition:all .2s;animation:${p=>p.$focused?glow:''} 2s ease-in-out infinite;
  cursor:text;
`;
const AIIcon = styled.div`font-size:1.2rem;flex-shrink:0`;
const SearchInput = styled.input`
  flex:1;border:none;background:transparent;color:#E2E8F0;font-size:.9rem;font-weight:600;
  outline:none;font-family:'Inter',sans-serif;
  &::placeholder{color:#475569}
`;
const KbdHint = styled.kbd`
  padding:3px 8px;border-radius:5px;border:1px solid rgba(100,116,139,0.2);
  background:rgba(30,41,59,0.8);font-size:.65rem;color:#64748B;font-family:'Courier New',monospace;
`;
const SearchBtn = styled.button`
  padding:8px 16px;border-radius:10px;border:none;background:linear-gradient(90deg,#1D4ED8,#3B82F6);
  color:#FFF;font-size:.78rem;font-weight:800;cursor:pointer;font-family:'Inter',sans-serif;
  white-space:nowrap;transition:all .15s;&:hover{filter:brightness(1.1)}
`;

const Dropdown = styled.div<{$show:boolean}>`
  position:absolute;top:calc(100% + 8px);left:0;right:0;border-radius:16px;
  background:rgba(10,18,40,0.98);backdrop-filter:blur(24px);
  border:1px solid rgba(59,130,246,0.2);overflow:hidden;z-index:200;
  display:${p=>p.$show?'block':'none'};animation:${fadeIn} .2s ease;
`;

const Section = styled.div`padding:12px 0`;
const SectionLabel = styled.div`padding:4px 16px;font-size:.62rem;font-weight:700;color:#475569;letter-spacing:.5px;text-transform:uppercase`;
const SuggRow = styled.div`
  display:flex;align-items:center;gap:10px;padding:9px 16px;cursor:pointer;transition:background .1s;
  &:hover{background:rgba(59,130,246,0.08)}
`;
const SuggIcon = styled.div`font-size:.85rem;flex-shrink:0;width:20px;text-align:center`;
const SuggText = styled.div`font-size:.78rem;color:#CBD5E1;font-weight:600`;
const SuggMeta = styled.div`font-size:.65rem;color:#475569;margin-top:1px`;
const SuggBadge = styled.div`margin-left:auto;font-size:.6rem;font-weight:700;padding:2px 7px;border-radius:4px;background:rgba(16,185,129,0.12);color:#10B981`;

const FilterChips = styled.div`display:flex;gap:6px;flex-wrap:wrap;padding:10px 16px 4px;border-top:1px solid rgba(100,116,139,0.1)`;
const Chip = styled.button<{$active:boolean}>`
  padding:4px 12px;border-radius:999px;border:1px solid ${p=>p.$active?'rgba(59,130,246,0.5)':'rgba(100,116,139,0.2)'};
  background:${p=>p.$active?'rgba(59,130,246,0.1)':'transparent'};
  color:${p=>p.$active?'#60A5FA':'#64748B'};font-size:.65rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all .15s;
`;

const SUGGESTIONS = [
  {icon:'🏠',text:'3 Bedroom Apartments in Dubai Marina',meta:'1,240 listings',badge:'Most Searched'},
  {icon:'🏝️',text:'Palm Jumeirah Villas for Sale',meta:'89 listings · From AED 18M'},
  {icon:'📈',text:'Off-Plan Projects Under AED 2M',meta:'412 units available'},
  {icon:'🏢',text:'Downtown Dubai Penthouses',meta:'24 listings · From AED 8.9M'},
  {icon:'💼',text:'Commercial Offices in Business Bay',meta:'156 listings'},
];

const FILTERS = ['Buy','Rent','Off-Plan','Commercial','Short-Term'];

export const HomepageSearchCommandBar: FC = () => {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState(new Set(['Buy']));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const h = (e:MouseEvent)=>{ if(ref.current&&!ref.current.contains(e.target as Node)) setFocused(false); };
    document.addEventListener('mousedown',h);
    return ()=>document.removeEventListener('mousedown',h);
  },[]);

  const toggleFilter = (f:string)=>setActiveFilters(prev=>{const n=new Set(prev);n.has(f)?n.delete(f):n.add(f);return n});

  return (
    <Wrap ref={ref} data-testid="homepage-search-command-bar">
      <SearchBar $focused={focused} onClick={()=>setFocused(true)}>
        <AIIcon>🔍</AIIcon>
        <SearchInput
          placeholder="Search by area, project, developer, or price..."
          value={query}
          onChange={e=>setQuery(e.target.value)}
          onFocus={()=>setFocused(true)}
        />
        <KbdHint>⌘K</KbdHint>
        <SearchBtn>Search</SearchBtn>
      </SearchBar>

      <Dropdown $show={focused}>
        <FilterChips>
          {FILTERS.map(f=>(
            <Chip key={f} $active={activeFilters.has(f)} onClick={()=>toggleFilter(f)}>{f}</Chip>
          ))}
        </FilterChips>

        <Section>
          <SectionLabel>✨ Popular Searches</SectionLabel>
          {SUGGESTIONS.map((s,i)=>(
            <SuggRow key={i} onClick={()=>{setQuery(s.text);setFocused(false)}}>
              <SuggIcon>{s.icon}</SuggIcon>
              <div>
                <SuggText>{s.text}</SuggText>
                <SuggMeta>{s.meta}</SuggMeta>
              </div>
              {s.badge && <SuggBadge>{s.badge}</SuggBadge>}
            </SuggRow>
          ))}
        </Section>
      </Dropdown>
    </Wrap>
  );
};
export default HomepageSearchCommandBar;
