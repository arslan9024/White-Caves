import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.85);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden`;
const Head = styled.div`padding:14px 18px;border-bottom:1px solid rgba(100,116,139,0.1);display:flex;align-items:center;justify-content:space-between`;
const HeadTitle = styled.div`font-size:.85rem;font-weight:700;color:#CBD5E1`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const InputGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:10px`;
const Field = styled.div`display:flex;flex-direction:column;gap:4px`;
const Label = styled.label`font-size:.68rem;color:#94A3B8;font-weight:600`;
const TextArea = styled.textarea`padding:10px 12px;border-radius:8px;border:1px solid rgba(139,92,246,0.2);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;resize:none;height:80px;outline:none;font-family:'Inter',sans-serif;box-sizing:border-box;&:focus{border-color:#8B5CF6}`;
const Select = styled.select`padding:8px 10px;border-radius:7px;border:1px solid rgba(139,92,246,0.2);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.75rem;font-weight:600;outline:none;&:focus{border-color:#8B5CF6}`;

const GenerateBtn = styled.button<{$loading:boolean}>`
  width:100%;padding:13px;border-radius:11px;border:none;cursor:pointer;
  background:linear-gradient(90deg,#7C3AED,#8B5CF6);color:#FFF;font-size:.88rem;font-weight:800;
  font-family:'Inter',sans-serif;transition:all .2s;opacity:${p=>p.$loading?.7:1};
  &:hover:not(:disabled){filter:brightness(1.1)}
`;

const ResultBox = styled.div`padding:14px 16px;border-radius:12px;background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.2)`;
const LangTab = styled.div`display:flex;gap:6px;margin-bottom:10px`;
const LangBtn = styled.button<{$active:boolean}>`padding:4px 12px;border-radius:6px;border:1px solid ${p=>p.$active?'rgba(139,92,246,0.5)':'rgba(100,116,139,0.15)'};background:${p=>p.$active?'rgba(139,92,246,0.1)':'transparent'};color:${p=>p.$active?'#A78BFA':'#64748B'};font-size:.65rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif`;
const ResultText = styled.div`font-size:.78rem;color:#CBD5E1;line-height:1.65;white-space:pre-wrap`;
const CopyBtn = styled.button`margin-top:10px;padding:6px 14px;border-radius:7px;border:1px solid rgba(139,92,246,0.3);background:rgba(139,92,246,0.08);color:#A78BFA;font-size:.68rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif`;

const EN_DESC = `Discover the pinnacle of luxury living at Marina Heights, where breathtaking panoramic sea views meet sophisticated urban design. This exquisite 2-bedroom residence, spanning 1,450 square feet on the 32nd floor, offers an unparalleled lifestyle in the heart of Dubai Marina.

The open-plan living area seamlessly flows onto a generous balcony, framing iconic vistas of the Arabian Gulf and the glittering marina skyline. The chef's kitchen features premium Miele appliances and Calacatta marble countertops. Both bedrooms are generously proportioned, with the master suite offering a spa-inspired en-suite and built-in wardrobes.

Residents enjoy exclusive access to a rooftop infinity pool, state-of-the-art fitness centre, private concierge, and 24-hour security. Walking distance to Marina Mall, JBR Beach, and the Dubai Tram.

Listed at AED 2,450,000 · Viewing by appointment with our luxury specialist team.`;

const AR_DESC = `اكتشف قمة الرقي والفخامة في برج مارينا هايتس، حيث تلتقي إطلالات البحر البانورامية الخلّابة مع التصميم الحضري الراقي. يقدّم هذا المسكن الاستثنائي المكوّن من غرفتَي نوم، الممتد على مساحة 1,450 قدم مربع في الطابق الثاني والثلاثين، أسلوب حياة لا مثيل له في قلب دبي مارينا.

السعر: 2,450,000 درهم إماراتي · الاستفسار عبر فريق المختصين.`;

export const AIListingDescriptionGenerator: FC = () => {
  const [desc, setDesc] = useState('');
  const [lang, setLang] = useState<'en'|'ar'>('en');
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    setTimeout(()=>{setLoading(false);setGenerated(true)},1200);
  };

  return (
    <Wrap data-testid="ai-listing-description-generator">
      <Head>
        <HeadTitle>✍️ AI Listing Description Generator</HeadTitle>
        <div style={{fontSize:'.68rem',color:'#8B5CF6',fontWeight:700}}>GPT-4 Powered</div>
      </Head>
      <Body>
        <InputGrid>
          <Field style={{gridColumn:'1/-1'}}><Label>Property Details (brief notes)</Label>
            <TextArea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="2BR, 1450 sqft, sea view, 32nd floor, Dubai Marina, AED 2.45M, pool, gym..." />
          </Field>
          <Field><Label>Style</Label>
            <Select><option>Luxury — Premium Tone</option><option>Standard — Professional</option><option>Investor — ROI Focus</option></Select>
          </Field>
          <Field><Label>Length</Label>
            <Select><option>Detailed (250-350 words)</option><option>Short (100-150 words)</option><option>Social (50-80 words)</option></Select>
          </Field>
        </InputGrid>

        <GenerateBtn $loading={loading} onClick={generate}>
          {loading?'🤖 Generating...':'🤖 Generate Bilingual Description (EN + AR)'}
        </GenerateBtn>

        {generated && (
          <ResultBox>
            <LangTab>
              <LangBtn $active={lang==='en'} onClick={()=>setLang('en')}>🇬🇧 English</LangBtn>
              <LangBtn $active={lang==='ar'} onClick={()=>setLang('ar')}>🇦🇪 Arabic</LangBtn>
            </LangTab>
            <ResultText style={{direction:lang==='ar'?'rtl':'ltr',textAlign:lang==='ar'?'right':'left'}}>
              {lang==='en'?EN_DESC:AR_DESC}
            </ResultText>
            <CopyBtn>📋 Copy to Clipboard</CopyBtn>
          </ResultBox>
        )}
      </Body>
    </Wrap>
  );
};
export default AIListingDescriptionGenerator;
