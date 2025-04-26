import { useState, useRef, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Button } from "./ui/button"
import { motion } from "framer-motion"

interface Message {
  sender: "user" | "bot"
  text: string
}

const Chat = () => {
  const { chatId } = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Load messages for this chat ID
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("chatMessages") || "{}")
    setMessages(stored[chatId!] || [])
  }, [chatId])

  // Save messages we maye need a database for this
  useEffect(() => {
    if (!chatId) return
    const allChats = JSON.parse(localStorage.getItem("chatMessages") || "{}")
    allChats[chatId] = messages
    localStorage.setItem("chatMessages", JSON.stringify(allChats))
  }, [messages, chatId])

  const handleSend = () => {
    if (!input.trim()) return
    const userMessage: Message = { sender: "user", text: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    // Update chat title if first message
    if (messages.length === 0) {
      const chats = JSON.parse(localStorage.getItem("chats") || "[]")
      const index = chats.findIndex((c: any) => c.id === chatId)
      if (index !== -1) {
        chats[index].title = userMessage.text.slice(0, 30)
        localStorage.setItem("chats", JSON.stringify(chats))
      }
    }

    // Fake bot reply
    setTimeout(() => {
      const botMessage: Message = {
        sender: "bot",
        text: `You said: "${userMessage.text}" 🤖`,
      };
      setMessages((prev) => [...prev, botMessage])
      setLoading(false)
    }, 1200)
  }

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="h-full flex flex-col bg-zinc-900 text-white px-4 pt-6 pb-2">
      <div className="flex-1 overflow-y-auto space-y-4 max-w-2xl mx-auto w-full">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
           <div
            className={`px-4 py-2 rounded-lg text-sm max-w-[80%] whitespace-pre-wrap break-words ${
                msg.sender === "user" ? "bg-blue-600" : "bg-zinc-700"
            }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-zinc-700 px-4 py-2 rounded-lg text-sm max-w-[80%] animate-pulse">
              <span className="inline-block animate-ping">...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 mt-4 max-w-2xl mx-auto w-full">
      <textarea
        className="flex-1 bg-zinc-800 text-white rounded-lg px-4 py-2 resize-none h-24 focus:outline-none"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
            }
        }}
        />
        <Button onClick={handleSend} disabled={loading}>
          Send
        </Button>
      </div>
    </div>
  )
}

export default Chat
