import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#061208,#0A1A10);border:2px solid rgba(37,211,102,0.3);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(37,211,102,0.06);border-bottom:1px solid rgba(37,211,102,0.15);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const MsgPreview = styled.div`padding:16px;border-radius:14px;background:rgba(15,23,42,0.9);border:1px solid rgba(37,211,102,0.2)`;
const MsgBubble = styled.div`padding:10px 14px;border-radius:12px 12px 4px 12px;background:#25D366;max-width:85%;margin:0 0 8px auto;box-shadow:0 2px 8px rgba(37,211,102,0.2)`;
const MsgText = styled.div`font-size:.75rem;color:#FFF;line-height:1.5`;
const MsgTime = styled.div`font-size:.6rem;color:rgba(255,255,255,0.6);text-align:right;margin-top:4px`;
const MsgStatus = styled.div`font-size:.75rem;color:rgba(255,255,255,0.7);text-align:right`;

const FieldGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:10px`;
const Field = styled.div`display:flex;flex-direction:column;gap:4px`;
const Label = styled.label`font-size:.7rem;color:#94A3B8;font-weight:600`;
const Input = styled.input`padding:8px 10px;border-radius:7px;border:1px solid rgba(37,211,102,0.2);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;font-weight:600;width:100%;box-sizing:border-box;outline:none;&:focus{border-color:#25D366}`;
const Select = styled.select`padding:8px 10px;border-radius:7px;border:1px solid rgba(37,211,102,0.2);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;font-weight:600;width:100%;outline:none;&:focus{border-color:#25D366}`;

const SendBtn = styled.button<{$sent:boolean}>`width:100%;padding:12px;border-radius:10px;border:none;background:${p=>p.$sent?'rgba(37,211,102,0.1)':'linear-gradient(90deg,#128C7E,#25D366)'};color:${p=>p.$sent?'#25D366':'#FFF'};font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

export const AppointmentWhatsAppNotifier: FC = () => {
  const [clientName, setClientName] = useState('Sarah Thompson');
  const [property, setProperty] = useState('Marina Heights, Unit 14B');
  const [date, setDate] = useState('2026-09-10');
  const [time, setTime] = useState('14:00');
  const [template, setTemplate] = useState('viewing');
  const [sent, setSent] = useState(false);

  const messages: Record<string, string> = {
    viewing: `Hi ${clientName} 👋\n\nYour property viewing has been confirmed!\n\n📍 *${property}*\n📅 ${new Date(date).toLocaleDateString('en-AE',{weekday:'long',day:'numeric',month:'long'})}\n🕐 ${time} GST\n\nYour agent Victoria Chen will meet you at the lobby. Please bring your Emirates ID.\n\nSee you soon! 🏡\n— White Caves Real Estate`,
    offer: `Dear ${clientName},\n\nGreat news! Your offer on *${property}* has been accepted! ✅\n\nNext step: Form F MOU signing at our office.\n📅 ${date} at ${time}\n\nPlease bring your passport & Emirates ID.\n\n— White Caves Real Estate`,
    reminder: `Hi ${clientName}! 👋 Friendly reminder:\n\n⏰ Your viewing at *${property}* is tomorrow at ${time}.\n\nReply CONFIRM to confirm or RESCHEDULE to book a new time.\n\n— White Caves Team`,
  };

  return (
    <Wrap data-testid="appointment-whatsapp-notifier">
      <Head>
        <Title>💬 WhatsApp Appointment Notifier</Title>
        <div style={{fontSize:'.7rem',color:'#25D366',fontWeight:700}}>Auto-Send</div>
      </Head>
      <Body>
        <FieldGrid>
          <Field><Label>Client Name</Label><Input value={clientName} onChange={e=>setClientName(e.target.value)} /></Field>
          <Field><Label>Message Template</Label>
            <Select value={template} onChange={e=>setTemplate(e.target.value)}>
              <option value="viewing">Viewing Confirmation</option>
              <option value="offer">Offer Accepted</option>
              <option value="reminder">24h Reminder</option>
            </Select>
          </Field>
          <Field><Label>Property</Label><Input value={property} onChange={e=>setProperty(e.target.value)} /></Field>
          <Field><Label>Date</Label><Input type="date" value={date} onChange={e=>setDate(e.target.value)} /></Field>
          <Field style={{gridColumn:'1/-1'}}><Label>Time</Label><Input type="time" value={time} onChange={e=>setTime(e.target.value)} /></Field>
        </FieldGrid>

        <MsgPreview>
          <div style={{fontSize:'.65rem',color:'#4ADE80',marginBottom:8,fontWeight:600}}>📱 WhatsApp Preview</div>
          <MsgBubble>
            <MsgText style={{whiteSpace:'pre-wrap'}}>{messages[template]}</MsgText>
            <MsgTime>{new Date().toLocaleTimeString('en-AE',{hour:'2-digit',minute:'2-digit'})} {sent?<MsgStatus>✓✓</MsgStatus>:<></>}</MsgTime>
          </MsgBubble>
        </MsgPreview>

        <SendBtn $sent={sent} onClick={()=>setSent(true)}>
          {sent?`✅ Sent to ${clientName}`:`📤 Send WhatsApp Message to ${clientName}`}
        </SendBtn>
      </Body>
    </Wrap>
  );
};
export default AppointmentWhatsAppNotifier;
