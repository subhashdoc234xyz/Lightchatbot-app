import React, { useState, useEffect, useRef } from 'react';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import SettingsModal from './components/SettingsModal';
import { streamChatCompletion, getSelectedModel, AVAILABLE_MODELS } from './services/groq';

const STORAGE_KEY = 'light_chat_history';

export default function App() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isStreaming, setIsStreaming] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [modelUpdateTrigger, setModelUpdateTrigger] = useState(0);
  const abortControllerRef = useRef(null);

  // Get active model display name
  const currentModelId = getSelectedModel();
  const currentModelObj = AVAILABLE_MODELS.find((m) => m.id === currentModelId);
  const currentModelName = currentModelObj
    ? currentModelObj.name.split(' (')[0]
    : 'GPT OSS 120B';

  // Sync messages to localStorage whenever they update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chat to localStorage', e);
    }
  }, [messages]);

  // Handle clearing the conversation
  const handleNewChat = () => {
    if (isStreaming) {
      handleStopStreaming();
    }
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  // Stop active streaming request
  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  };

  // Send message and stream reply from Groq
  const handleSendMessage = async (userText) => {
    if (!userText || isStreaming) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
    };

    // Prepare updated message list with user query
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Placeholder for incoming assistant reply
    const assistantId = (Date.now() + 1).toString();
    const assistantMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
    };

    setMessages([...updatedMessages, assistantMessage]);
    setIsStreaming(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    let accumulatedText = '';

    await streamChatCompletion({
      messages: updatedMessages,
      signal: controller.signal,
      onChunk: (chunk) => {
        accumulatedText += chunk;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: accumulatedText } : msg
          )
        );
      },
      onFinish: () => {
        setIsStreaming(false);
        abortControllerRef.current = null;
      },
      onError: (errorMessage) => {
        setIsStreaming(false);
        abortControllerRef.current = null;
        // Display friendly error bubble
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? {
                  ...msg,
                  content: errorMessage,
                  isError: true,
                }
              : msg
          )
        );
      },
    });
  };

  return (
    <div className="flex flex-col h-screen w-screen ambient-bg text-slate-100 overflow-hidden select-text">
      {/* Main Chat Interface */}
      <ChatWindow
        messages={messages}
        isStreaming={isStreaming}
        onNewChat={handleNewChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSelectPrompt={handleSendMessage}
        currentModelName={currentModelName}
      />

      {/* Message Input Box */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onStopStreaming={handleStopStreaming}
        isStreaming={isStreaming}
      />

      {/* Settings Modal (API Key & Model choice) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={() => setModelUpdateTrigger((c) => c + 1)}
      />
    </div>
  );
}
