import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  text: string;
  isUser: boolean;
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

function AI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (inputText.trim() === '' || isLoading) return;

    const newMessages = [...messages, { text: inputText, isUser: true }];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      const result = await model.generateContent(inputText);
      const response = result.response;
      const text = response.text().split("*");
      setMessages([...newMessages, { text, isUser: false }]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      setMessages([...newMessages, { text: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.", isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
   
    <div className="main-m flex flex-col   bg-gray-200">
      <header className="bg-green-700 rounded-t-xl  text-white p-4 text-xl font-bold">
        Suni Intellektden Sorus
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-xs md:max-w-md ${message.isUser ? 'bg-blue-500 text-white' : 'bg-white'} rounded-lg p-3 shadow`}>
              {!message.isUser && <Bot className="inline-block mr-2" size={20} />}
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white rounded-lg p-3 shadow">
              <Bot className="inline-block mr-2" size={20} />
              Cavab verirem...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t">
        <div className="flex  ">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="w-24 flex-1 border rounded-l-lg p-2 focus:outline-none "
            placeholder="Mesajınızı yazın..."
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            className={` bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>

   
  );
}

export default AI;