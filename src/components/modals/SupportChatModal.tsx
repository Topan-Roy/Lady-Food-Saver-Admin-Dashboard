import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Send, User, CheckCircle } from 'lucide-react';
interface SupportChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: any;
  onResolve?: () => void;
}

export function SupportChatModal({
  isOpen,
  onClose,
  ticket,
  onResolve
}: SupportChatModalProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([{
    id: 1,
    sender: 'user',
    text: 'Hi, I have an issue with my order.',
    time: '10:30 AM'
  }, {
    id: 2,
    sender: 'admin',
    text: 'Hello! I can help with that. What seems to be the problem?',
    time: '10:32 AM'
  }, {
    id: 3,
    sender: 'user',
    text: 'The food arrived cold and items were missing.',
    time: '10:35 AM'
  }]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, {
      id: Date.now(),
      sender: 'admin',
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    }]);
    setMessage('');
  };

  if (!ticket) return null;

  return <Modal isOpen={isOpen} onClose={onClose} title={`Ticket #${ticket.id} - ${ticket.subject}`} size="lg">
    <div className="flex flex-col h-[500px]">
      <div className="bg-gray-50 p-4 rounded-lg mb-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-6 w-6 text-gray-500" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{ticket.user}</p>
            <p className="text-xs text-gray-500">
              {ticket.type} • {ticket.status}
            </p>
          </div>
        </div>
        <Button size="sm" variant="outline" leftIcon={<CheckCircle className="h-4 w-4" />} onClick={onResolve}>
          Mark Resolved
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-2 mb-4 border border-gray-100 rounded-lg">
        {messages.map(msg => <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'admin' ? 'bg-[#FF6B35] text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
            <p className="text-sm">{msg.text}</p>
            <p className={`text-[10px] mt-1 text-right ${msg.sender === 'admin' ? 'text-orange-100' : 'text-gray-400'}`}>
              {msg.time}
            </p>
          </div>
        </div>)}
      </div>

      <div className="flex gap-2">
        <Input placeholder="Type your reply..." value={message} onChange={e => setMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} />
        <Button onClick={handleSend} leftIcon={<Send className="h-4 w-4" />}>
          Send
        </Button>
      </div>
    </div>
  </Modal>;
}