import { describe, it, expect, vi } from 'vitest';
import { NinaService } from './NinaService.js';

describe('NinaService NLP Engine', () => {
  it('should correctly detect English and Arabic languages', () => {
    expect(NinaService.detectLanguage('Hello, I am looking for a villa')).toBe('en');
    expect(NinaService.detectLanguage('مرحبا أريد شراء فيلا في دبي')).toBe('ar');
  });

  it('should classify intents correctly', () => {
    expect(NinaService.classifyIntent('Hi there').intent).toBe('greeting');
    expect(NinaService.classifyIntent('I want to buy a 3 bedroom villa in Palm Jumeirah').intent).toBe('property_inquiry');
    expect(NinaService.classifyIntent('I want to schedule a viewing tomorrow').intent).toBe('viewing_request');
    expect(NinaService.classifyIntent('I need to speak to a human agent').intent).toBe('escalation');
  });

  it('should extract entities (area, budget, bedrooms, property type)', () => {
    const text = 'Looking for a 3 bed villa in Palm Jumeirah budget 5M AED';
    const entities = NinaService.extractEntities(text);

    expect(entities.area).toBe('Palm Jumeirah');
    expect(entities.bedrooms).toBe(3);
    expect(entities.budget).toBe(5000000);
    expect(entities.propertyType).toBe('Villa');
  });

  it('should process multi-turn conversation state machine', async () => {
    const res1 = await NinaService.process({
      message: 'Hello',
      from: '971501112233',
    });

    expect(res1.action).toBe('bot_reply');
    expect(res1.intent).toBe('greeting');
    expect(res1.nextState).toBe('COLLECTING_TYPE');

    const res2 = await NinaService.process({
      message: 'Looking for a villa in Dubai Marina budget 4 million',
      from: '971501112233',
    });

    expect(res2.action).toBe('bot_reply');
    expect(res2.entities.area).toBe('Dubai Marina');
    expect(res2.entities.budget).toBe(4000000);
  });
});
