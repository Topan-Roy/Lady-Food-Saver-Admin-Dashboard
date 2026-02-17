import { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Send, User, CheckCircle, Loader2 } from 'lucide-react';
import {
  useGetOrCreateConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation
} from '@/redux/features/chat.ts';

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
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [getOrCreateConversation, { isLoading: isCreatingChat }] = useGetOrCreateConversationMutation();
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    refetch: refetchMessages
  } = useGetMessagesQuery(
    { conversationId: conversationId! },
    { skip: !conversationId, pollingInterval: 3000 }
  );

  useEffect(() => {
    if (isOpen && ticket) {
      const handleInitChat = async () => {
        try {
          // Use providerId for restaurants and customerId for customers
          // Fallback to ticket.id if not present
          const targetId = ticket.providerId || ticket.customerId || ticket.userId || ticket.id;
          const payload = ticket.type?.toLowerCase() === 'restaurant'
            ? { providerId: targetId }
            : { providerId: targetId }; // Based on user example, even for customer they might use providerId in the body for the query part? 
          // Wait, the user prompt said "akane je customer ar kate message korbe tar id" but the key was providerId.
          // I'll stick to providerId as per user's post body example.

          const result = await getOrCreateConversation(payload).unwrap();
          if (result.data?.id) {
            setConversationId(result.data.id);
          }
        } catch (error) {
          console.error("Failed to init chat:", error);
        }
      };
      handleInitChat();
    }
  }, [isOpen, ticket, getOrCreateConversation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messagesData]);

  const handleSend = async () => {
    if (!message.trim() || !conversationId) return;

    try {
      const targetId = ticket.providerId || ticket.customerId || ticket.userId || ticket.id;
      await sendMessage({
        receiverId: targetId,
        text: message
      }).unwrap();

      setMessage('');
      refetchMessages();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!ticket) return null;

  const chatMessages = messagesData?.data?.messages || [];

  return <Modal isOpen={isOpen} onClose={onClose} title={`Ticket #${ticket.id} - ${ticket.subject}`} size="lg">
    <div className="flex flex-col h-[600px]">
      <div className="bg-gray-200/50 backdrop-blur-sm p-4 rounded-2xl mb-4 flex justify-between items-center border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100">
            <User className="h-6 w-6 text-[#FF6B35]" />
          </div>
          <div>
            <p className="font-bold text-gray-900">{ticket.user}</p>
            <p className="text-xs font-medium text-gray-500 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${ticket.status === 'Open' ? 'bg-red-500' : 'bg-green-500'}`} />
              {ticket.type} • {ticket.status}
            </p>
          </div>
        </div>
        <Button size="sm" variant="outline" leftIcon={<CheckCircle className="h-4 w-4" />} onClick={onResolve} className="rounded-xl">
          Mark Resolved
        </Button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 p-4 mb-4 bg-gray-50/50 rounded-2xl border border-gray-100 scroll-smooth"
      >
        {isLoadingMessages || isCreatingChat ? (
          <div className="flex items-center justify-center h-full gap-2 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">Loading conversation...</span>
          </div>
        ) : chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Send className="h-6 w-6 opacity-20" />
            </div>
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          chatMessages.map((msg: any) => {
            const isMe = msg.sender?.role === 'ADMIN' || msg.senderId === 'ADMIN'; // Adjust based on actual payload
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[75%] space-y-1`}>
                  <div className={`p-4 rounded-2xl shadow-sm ${isMe
                      ? 'bg-[#FF6B35] text-white rounded-tr-none'
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                    }`}>
                    {msg.attachmentUrl && (
                      <img src={msg.attachmentUrl} alt="attachment" className="rounded-lg mb-2 max-h-48 w-full object-cover" />
                    )}
                    <p className="text-[14px] leading-relaxed font-medium">{msg.content || msg.text}</p>
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isMe ? 'text-right text-[#FF6B35]/50' : 'text-gray-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex gap-3 p-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <Input
          className="border-none shadow-none focus:ring-0 text-sm"
          placeholder="Type your message here..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          disabled={isSending || !conversationId}
        />
        <Button
          onClick={handleSend}
          disabled={isSending || !message.trim() || !conversationId}
          className="rounded-xl px-6"
          leftIcon={isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        >
          {isSending ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  </Modal>;
}