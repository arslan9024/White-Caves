# Nadia WhatsApp AI Assistant & CSAT Social Review Protocol

**Document Ref:** AI-NADIA-ROUTING-2026  
**Integration:** Nadia WhatsApp Conversational AI Node  
**Lead:** @Joelle (ML Lead) & @Rachel (Communications Lead)  
**Status:** ✅ Canonical Operational Manual  

---

## 1. Nadia WhatsApp Conversational Router

Nadia is White Caves' official WhatsApp AI Assistant. She processes incoming WhatsApp DMs, answers property availability inquiries in English and Arabic, and schedules viewing requests.

```
┌─────────────────────────────────────────────────────────────────────────┐
│               NADIA WHATSAPP AI CONVERSATIONAL ROUTER                   │
├──────────────┬──────────────┬──────────────┬──────────────┬─────────────┤
│ WhatsApp DM  │ NLP Language │ Instant      │ Lead Score   │ Handover to │
│ Received     │ Detection    │ Auto-Reply   │ & Intent     │ Human Broker│
│ (+971...)    │ (EN / AR)    │ Synthesis    │ Classification│ (If High)  │
└──────────────┴──────────────┴──────────────┴──────────────┴─────────────┘
```

---

## 2. 5-Star Social Review Invitation Pipeline

Upon successful transaction closing or high CSAT feedback rating (5 out of 5 stars):

1. **CSAT Trigger**: Tenant or Buyer submits 5-star rating via CRM feedback form.
2. **Automated Invitation**: Nadia sends personalized WhatsApp invitation link to client requesting Google Business & Trustpilot review.
3. **Reward Token**: Client receives automatic entry into White Caves VIP Quarterly Raffle.

---

## 3. Nadia SLA & Routing Rules

| Parameter | Specification | Action |
|---|---|---|
| **Response Latency** | < 3 Seconds | Instant AI Reply |
| **Language Support** | English, Arabic, French, Russian | Auto-Detect & Switch |
| **Human Escalation** | Intent = "Speak to Agent" or Budget > 5M AED | Immediate Broker Transfer |
| **CSAT Threshold** | Rating = 5 Stars | Trigger Social Review Flow |
