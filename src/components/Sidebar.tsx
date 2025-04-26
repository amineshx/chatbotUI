import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { Plus } from "lucide-react"

interface Chat {
  id: string
  title: string
}

const Sidebar=()=> {
  const navigate = useNavigate()
  const location = useLocation()
  const [chats, setChats] = useState<Chat[]>([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("chats") || "[]")
    setChats(saved)
  }, [location])

  const newChat = () => {
    const id = crypto.randomUUID()
    const newChat: Chat = { id, title: "New Chat" }
    const updated = [newChat, ...chats]
    localStorage.setItem("chats", JSON.stringify(updated))
    setChats(updated);
    navigate(`/chat/${id}`)
  };

  return (
    <div className="w-64 bg-[#202123] text-white p-4 flex flex-col">
      {/* New Chat */}
      <button
        onClick={newChat}
        className="flex items-center gap-2 bg-[#343541] hover:bg-[#3c3d44] p-2 rounded mb-4"
      >
        <Plus size={18} /> New Chat
      </button>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => navigate(`/c/${chat.id}`)}
            className="text-left w-full bg-[#343541] hover:bg-[#3c3d44] p-2 rounded text-sm truncate"
          >
            {chat.title}
          </button>
        ))}
      </div>
    </div>
  )
}
export default Sidebar