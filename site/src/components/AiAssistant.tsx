import React, { useState, useRef, useEffect } from 'react'
import './AiAssistant.css'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I am the Vertical Constructions AI Assistant. How can I help you with your structural engineering or development project?' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.href, // Required for OpenRouter
          'X-Title': 'Vertical Constructions', // Required for OpenRouter
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'openrouter/free',
          messages: [
            { 
              role: 'system', 
              content: 'You are an elite AI assistant representing "Vertical Constructions", a high-end construction and structural engineering firm based in Noida, India. Answer questions concisely, professionally, and enthusiastically about construction, engineering, architecture, and the company services (Residential, Commercial, Industrial). Use a confident, industrial tone.'
            },
            ...messages,
            userMessage
          ]
        })
      })

      const data = await response.json()
      console.log('OpenRouter API Response:', data)
      if (data.choices && data.choices.length > 0) {
        setMessages(prev => [...prev, data.choices[0].message])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `API Error: ${data.error ? data.error.message : JSON.stringify(data)}` }])
      }
    } catch (error: any) {
      console.error('Fetch Error:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: `Connection error: ${error.message}` }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button 
        className={`ai-fab ${isOpen ? 'ai-fab--hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Assistant"
      >
        <span className="material-symbols-outlined">smart_toy</span>
      </button>

      <div className={`ai-chat ${isOpen ? 'ai-chat--open' : ''}`}>
        <div className="ai-chat__header">
          <div className="ai-chat__header-info">
            <span className="material-symbols-outlined ai-chat__icon">engineering</span>
            <div>
              <h3 className="ai-chat__title">VC Assistant</h3>
              <p className="ai-chat__status">Powered by Gemma 3</p>
            </div>
          </div>
          <button className="ai-chat__close" onClick={() => setIsOpen(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="ai-chat__messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`ai-message ai-message--${msg.role}`}>
              <div className="ai-message__bubble">
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="ai-message ai-message--assistant">
              <div className="ai-message__bubble ai-message__bubble--loading">
                <span className="ai-dot"></span>
                <span className="ai-dot"></span>
                <span className="ai-dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="ai-chat__input-area" onSubmit={handleSubmit}>
          <input
            type="text"
            className="ai-chat__input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about our services..."
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="ai-chat__send" 
            disabled={!input.trim() || isLoading}
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>
    </>
  )
}
