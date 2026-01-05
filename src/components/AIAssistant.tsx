import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChatMessage } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import AsyncErrorFallback from '@/components/AsyncErrorFallback';
import { MessageCircle, Send, Bot, User } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const { t, language } = useLanguage();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: t.welcomeMessage,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // ✅ NEW: async error handling states
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('बुखार') || lowerMessage.includes('fever')) {
      return language === 'hi'
        ? 'बुखार कितने दिनों से है? और क्या कोई और तकलीफ भी है जैसे सर्दी, खांसी, या शरीर में दर्द?'
        : 'How many days have you had fever? Do you have any other problems like cold, cough, or body pain?';
    }

    if (lowerMessage.includes('पेट') || lowerMessage.includes('stomach') || lowerMessage.includes('दर्द')) {
      return language === 'hi'
        ? 'पेट में दर्द कहां है? क्या खाने के बाद बढ़ता है? उल्टी या दस्त हो रहे हैं क्या?'
        : 'Where is the stomach pain? Does it increase after eating? Do you have vomiting or loose motions?';
    }

    if (lowerMessage.includes('सर्दी') || lowerMessage.includes('cold') || lowerMessage.includes('खांसी') || lowerMessage.includes('cough')) {
      return language === 'hi'
        ? 'खांसी में बलगम आता है क्या? सांस लेने में दिक्कत तो नहीं? कितने दिनों से है?'
        : 'Do you have phlegm with cough? Any difficulty breathing? How many days have you had this?';
    }

    if (lowerMessage.includes('सिर') || lowerMessage.includes('head') || lowerMessage.includes('headache')) {
      return language === 'hi'
        ? 'सिर में दर्द कब से है? क्या रोशनी से दिक्कत होती है? उल्टी जैसा लगता है क्या?'
        : 'How long have you had headache? Does light bother you? Do you feel like vomiting?';
    }

    if (lowerMessage.includes('चक्कर') || lowerMessage.includes('dizzy')) {
      return language === 'hi'
        ? 'चक्कर कब आते हैं - खड़े होने पर या हमेशा? खाना ठीक से खा रहे हैं? पानी कम तो नहीं पी रहे?'
        : 'When do you feel dizzy - when standing or always? Are you eating properly? Drinking enough water?';
    }

    if (lowerMessage.includes('गंभीर') || lowerMessage.includes('serious')) {
      return language === 'hi'
        ? '⚠️ आपकी स्थिति गंभीर लग रही है। कृपया तुरंत डॉक्टर को दिखाएं।'
        : '⚠️ Your condition seems serious. Please consult a doctor immediately.';
    }

    return language === 'hi'
      ? 'मैं समझ रहा हूं। कृपया थोड़ा और बताएं।'
      : 'I understand. Please tell me more.';
  };

  // ✅ NEW: async-safe handler
  const sendMessageAsync = async (text: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulated async delay (same behavior, safer handling)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(text),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error('AI Assistant error:', err);
      setError('Unable to fetch AI response. Please try again.');
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    sendMessageAsync(input);
  };

  const handleRetry = () => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMessage) {
        setIsTyping(true);
        sendMessageAsync(lastUserMessage.content);
      }
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <AsyncErrorFallback message={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto border-2 border-border shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6" />
            {t.aiAssistant}
          </CardTitle>
        </CardHeader>

        <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                  {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className="max-w-[80%] p-3 rounded-lg bg-secondary">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {isTyping && <p className="text-sm text-muted-foreground">AI is typing…</p>}
          </div>
        </ScrollArea>

        <CardContent className="border-t-2 border-border p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.askHealth}
              disabled={loading}
            />
            <Button onClick={handleSend} disabled={loading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
