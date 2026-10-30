import { Request, Response } from 'express';
import { GROQ_API_KEY, OLLAMA_HOST } from '../../config/env.js';

export const ocrEmiratesId = async (req: Request, res: Response) => {
  try {
    const { imageBase64, imageUrl } = req.body;

    if (!imageBase64 && !imageUrl) {
      return res.status(400).json({ success: false, error: 'imageBase64 or imageUrl is required' });
    }

    const ollamaEndpoint = `${OLLAMA_HOST}/api/generate`;

    const prompt = `You are an Emirates ID card OCR parser. Extract the following fields from this Emirates ID card image and return them as a JSON object:
{
  "name": "Full name in English",
  "nameArabic": "Full name in Arabic",
  "emiratesId": "ID number in format 784-YYYY-XXXXXXX-D",
  "dateOfBirth": "DD/MM/YYYY",
  "nationality": "Nationality",
  "gender": "Male or Female",
  "expiryDate": "DD/MM/YYYY",
  "cardNumber": "Card number if visible"
}
Return ONLY the JSON object. If a field is not visible or readable, use null for that field.
Confidence: include a "confidence" field from 0.0 to 1.0 indicating overall extraction confidence.`;

    const ollamaRequest = {
      model: 'llava',
      prompt,
      images: imageBase64 ? [imageBase64] : undefined,
      stream: false,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    let extractedData: Record<string, unknown> = {};
    let confidence = 0;

    try {
      const ollamaRes = await fetch(ollamaEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ollamaRequest),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (ollamaRes.ok) {
        const ollamaData = (await ollamaRes.json()) as { response?: string };
        const raw = ollamaData?.response ?? '';
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
          confidence = typeof parsed.confidence === 'number' ? parsed.confidence : 0.6;
          delete parsed.confidence;
          extractedData = parsed;
        }
      }
    } catch (ollamaError) {
      clearTimeout(timeout);
      console.warn(
        '[Henry OCR] Ollama unavailable:',
        ollamaError instanceof Error ? ollamaError.message : ollamaError
      );
    }

    if (extractedData.emiratesId) {
      const eidPattern = /784-\d{4}-\d{7}-\d/;
      const eidStr = String(extractedData.emiratesId);
      const match = eidStr.match(eidPattern);
      if (match) {
        extractedData.emiratesId = match[0];
        confidence = Math.min(confidence + 0.1, 1);
      } else {
        extractedData.emiratesId = null;
        confidence = Math.max(confidence - 0.1, 0);
      }
    }

    res.json({
      success: true,
      data: {
        ...extractedData,
        confidence,
        ocrProvider: 'ollama',
        processedAt: new Date(),
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const extractAiFields = async (req: Request, res: Response) => {
  try {
    const { text, templateKey } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, error: 'text is required' });
    }

    if (!GROQ_API_KEY) {
      const ollamaPrompt = `Extract structured document fields from the following text for a ${templateKey ?? 'real estate'} document template. Return as JSON:\n\n${String(text).substring(0, 2000)}`;
      const ollamaRes = await fetch(`${OLLAMA_HOST}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'mistral', prompt: ollamaPrompt, stream: false }),
      });
      if (!ollamaRes.ok) {
        return res
          .status(503)
          .json({
            success: false,
            error: 'AI extraction unavailable — configure GROQ_API_KEY or ensure Ollama is running',
          });
      }
      const ollamaData = (await ollamaRes.json()) as { response?: string };
      const raw = ollamaData?.response ?? '';
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      const fields = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
      return res.json({ success: true, data: { fields, provider: 'ollama', confidence: 0.6 } });
    }

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: `You are a Dubai real estate document parser. Extract structured data from document text and return ONLY a JSON object with field names matching common real estate document fields (landlordName, tenantName, propertyAddress, startDate, endDate, annualRent, etc.). Include a "confidence" field (0–1).`,
          },
          {
            role: 'user',
            content: `Extract fields from this ${templateKey ?? 'document'} text:\n\n${String(text).substring(0, 4000)}`,
          },
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      return res
        .status(500)
        .json({ success: false, error: `Groq API error: ${errText.substring(0, 200)}` });
    }

    const groqData = (await groqRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = groqData?.choices?.[0]?.message?.content ?? '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const fields = jsonMatch ? (JSON.parse(jsonMatch[0]) as Record<string, unknown>) : {};
    const confidence = typeof fields.confidence === 'number' ? fields.confidence : 0.8;
    delete fields.confidence;

    res.json({ success: true, data: { fields, provider: 'groq', confidence } });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const draftAi = async (req: Request, res: Response) => {
  try {
    const { generateDocumentDraft } = await import('../../services/henry/aiDocumentDrafter.js');
    const result = await generateDocumentDraft(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const submitEjari = async (req: Request, res: Response) => {
  try {
    const { submitToEjari } = await import('../../services/henry/ejariService.js');
    const result = await submitToEjari(req.body);
    const status = result.success ? 200 : 422;
    res.status(status).json({ success: result.success, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const translateAi = async (req: Request, res: Response) => {
  try {
    const { generateMultiLangContract } = await import('../../services/henry/multiLangContract.js');
    const result = await generateMultiLangContract(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
};
