import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(139,92,246,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(139,92,246,0.05);border-bottom:1px solid rgba(139,92,246,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const AudioMsg = styled.div`display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:12px;background:rgba(15,23,42,0.7);border:1px solid rgba(139,92,246,0.2)`;
const PlayBtn = styled.button`width:36px;height:36px;border-radius:50%;border:none;background:linear-gradient(135deg,#7C3AED,#8B5CF6);color:#FFF;font-size:.8rem;cursor:pointer;flex-shrink:0;transition:all .2s;&:hover{filter:brightness(1.2)}`;
const Waveform = styled.div`display:flex;align-items:center;gap:2px;flex:1;height:28px`;
const WaveBar = styled.div<{$h:number;$active:boolean}>`width:3px;border-radius:2px;height:${p=>p.$h}%;background:${p=>p.$active?'#8B5CF6':'rgba(139,92,246,0.3)'};transition:background .2s`;
const AudioMeta = styled.div`font-size:.65rem;color:#64748B;flex-shrink:0`;

const TranscriptCard = styled.div`padding:14px;border-radius:12px;background:rgba(15,23,42,0.8);border:1px solid rgba(139,92,246,0.15)`;
const TranscriptLang = styled.div`display:flex;gap:6px;margin-bottom:8px`;
const LangTag = styled.div<{$active:boolean}>`padding:2px 9px;border-radius:5px;font-size:.65rem;font-weight:700;background:${p=>p.$active?'rgba(139,92,246,0.15)':'rgba(100,116,139,0.1)'};color:${p=>p.$active?'#A78BFA':'#64748B'}`;
const TranscriptText = styled.div`font-size:.76rem;color:#CBD5E1;line-height:1.55;font-style:italic`;
const TranscriptAR = styled.div`font-size:.8rem;color:#A78BFA;line-height:1.7;text-align:right;direction:rtl;margin-top:8px;padding-top:8px;border-top:1px solid rgba(139,92,246,0.12)`;

const WAVEBARS = [40,60,80,100,70,90,50,75,85,60,40,55,80,95,70,45,60,85,70,50,65,90,75,55,80,40,70,100,60,45];

const TranscribeBtn = styled.button<{$done:boolean}>`width:100%;padding:12px;border-radius:10px;border:none;background:${p=>p.$done?'rgba(139,92,246,0.1)':'linear-gradient(90deg,#7C3AED,#8B5CF6)'};color:${p=>p.$done?'#A78BFA':'#FFF'};font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

export const WhisperAudioTranscription: FC = () => {
  const [playing, setPlaying] = useState(false);
  const [transcribed, setTranscribed] = useState(false);
  const [lang, setLang] = useState<'en'|'ar'>('en');

  const transcribe = () => { setTranscribed(false); setTimeout(()=>setTranscribed(true),1800); };

  return (
    <Wrap data-testid="whisper-audio-transcription">
      <Head>
        <Title>🎤 Whisper Audio Transcription</Title>
        <div style={{fontSize:'.7rem',color:'#8B5CF6',fontWeight:700}}>AR + EN</div>
      </Head>
      <Body>
        <AudioMsg>
          <PlayBtn onClick={()=>setPlaying(!playing)}>{playing?'⏸':'▶'}</PlayBtn>
          <Waveform>
            {WAVEBARS.map((h,i)=><WaveBar key={i} $h={h} $active={playing&&i<15} />)}
          </Waveform>
          <AudioMeta>0:32</AudioMeta>
        </AudioMsg>

        {transcribed && (
          <TranscriptCard>
            <TranscriptLang>
              <LangTag $active={lang==='en'} onClick={()=>setLang('en')} style={{cursor:'pointer'}}>🇬🇧 English</LangTag>
              <LangTag $active={lang==='ar'} onClick={()=>setLang('ar')} style={{cursor:'pointer'}}>🇦🇪 Arabic</LangTag>
            </TranscriptLang>
            {lang==='en' ? (
              <TranscriptText>
                "I am very interested in the Marina Heights apartment. I need 3 bedrooms and my budget is around 2.5 million dirhams. Can we arrange a viewing this weekend? I prefer Saturday afternoon if possible."
              </TranscriptText>
            ) : (
              <TranscriptAR>
                "أنا مهتم جدًا بشقة مارينا هايتس. أحتاج إلى 3 غرف نوم وميزانيتي حوالي 2.5 مليون درهم. هل يمكننا ترتيب زيارة هذا الأسبوع؟ أفضل يوم السبت بعد الظهر إن أمكن."
              </TranscriptAR>
            )}
          </TranscriptCard>
        )}

        <TranscribeBtn $done={transcribed} onClick={transcribe}>
          {transcribed?'✅ Transcription Complete — Copy to CRM':'🎤 Transcribe Voice Note (Whisper API)'}
        </TranscribeBtn>
      </Body>
    </Wrap>
  );
};
export default WhisperAudioTranscription;
