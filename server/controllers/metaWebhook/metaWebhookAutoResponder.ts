import { prisma } from '../../database.js';
import { generateWhatsAppAutoResponse } from '../../services/nadia/whatsappAssistant.js';
import { processChatWithOpenAI, ChatMessage } from '../../services/nadia/openaiProcessor.js';

export async function generateBotReply(
  content: string,
  contactName?: string,
  conversationId?: string
): Promise<string> {
  const isArabic = /[\u0600-\u06FF]/.test(content);
  if (isArabic) {
    return 'أهلاً بك في وايتكيفز للعقارات! 🏰 كيف يمكننا مساعدتك اليوم في بحثك عن العقارات أو حجز موعد للمعاينة؟';
  }

  const autoResponse = generateWhatsAppAutoResponse({
    message: content,
    customerName: contactName,
  });

  let reply = autoResponse.response;

  if (process.env.OPENAI_API_KEY && conversationId) {
    try {
      const recentMessages = await prisma.nadiaMessage.findMany({
        where: { conversationId },
        orderBy: { timestamp: 'desc' },
        take: 5,
      });

      const chatMessages = recentMessages.reverse().map(m => ({
        role: m.direction === 'inbound' ? 'user' : 'assistant',
        content: m.body,
      })) as ChatMessage[];

      const timeoutPromise = new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error('OpenAI timeout')), 1000)
      );

      reply = await Promise.race([processChatWithOpenAI(chatMessages), timeoutPromise]);
    } catch {
      reply = autoResponse.response;
    }
  }

  return reply;
}
