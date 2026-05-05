import { useState } from "react"
import { motion } from "framer-motion"
import whatsappIcon from "../assets/images/whatsaap.png"

function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm RelocateX assistant. How can I help you today? 😊" }
  ])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)

  // WhatsApp number — .env mein VITE_WHATSAPP_NUMBER set karo
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "918766735828"

  const sendMessage = async () => {
    if (!input.trim() || sending) return

    const userMsg = { sender: "user", text: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setSending(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "https://localhost:7266"
      const response = await fetch(`${apiUrl}/api/Chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, { sender: "bot", text: data.reply || "Thank you for your message! Our team will get back to you soon." }])
      } else {
        setMessages(prev => [...prev, { sender: "bot", text: "Sorry, I couldn't process that. Please try WhatsApp for faster response." }])
      }
    } catch {
      // API nahi mila toh fallback message
      setMessages(prev => [...prev, { sender: "bot", text: "I'm having trouble connecting. Please contact us on WhatsApp! 📱" }])
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage()
  }

  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-3 items-end z-50">

      {/* WhatsApp Button */}
      <motion.a
        whileHover={{ scale: 1.1 }}
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white p-4 rounded-full shadow-lg"
      >
        <img src={whatsappIcon} alt="WhatsApp" className="w-6 h-6" />
      </motion.a>

      {/* ChatBot Toggle Button */}
      {!open && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg"
        >
          🤖
        </motion.button>
      )}

      {/* Chat Window */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-80 bg-white shadow-2xl rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 flex justify-between items-center">
            <span className="font-bold">Ask RelocateX 🤖</span>
            <button onClick={() => setOpen(false)} className="text-white">✖</button>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`px-3 py-2 rounded-xl text-sm max-w-[85%]
                  ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-800 shadow-sm"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-xl text-sm bg-white text-gray-400 shadow-sm">
                  Typing...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex p-2 border-t bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border rounded-xl px-3 py-2 text-sm"
              placeholder="Ask about services..."
              disabled={sending}
            />
            <button
              onClick={sendMessage}
              disabled={sending}
              className={`ml-2 px-3 rounded-xl text-white ${sending ? "bg-blue-400" : "bg-blue-600"}`}>
              📤
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ChatBot
