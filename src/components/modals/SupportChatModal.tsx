import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Send, User, CheckCircle, Loader2 } from 'lucide-react';
import {
  useGetOrCreateConversationMutation,
  useGetMessagesQuery,
  useAdminStartCustomerConversationMutation,
  useAdminSendMessageMutation,
  useAdminToProviderMutation,
  useArchiveConversationMutation
} from '../../redux/features/chat';

interface SupportChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: any;
  onResolve?: () => void;
}

const getIdValue = (value: any) => {
  if (!value) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object') return String(value._id || value.id || '');
  return '';
};

const isRestaurantTicket = (ticket: any) => {
  const userType = String(ticket?.userType || ticket?.type || '').toLowerCase();
  return userType === 'restaurant' || userType === 'provider';
};

const getTicketTargetId = (ticket: any) => {
  if (!ticket) return '';

  if (isRestaurantTicket(ticket)) {
    return (
      getIdValue(ticket.providerId) ||
      getIdValue(ticket.userID) ||
      getIdValue(ticket.userId)
    );
  }

  return (
    getIdValue(ticket.customerId) ||
    getIdValue(ticket.userID) ||
    getIdValue(ticket.userId)
  );
};

const getConversationId = (source: any) => {
  const directId = getIdValue(source);
  if (directId) return directId;

  const data = source?.data || source;
  const conversation = data?.conversation || data;

  return (
    getIdValue(data?.conversationId) ||
    getIdValue(conversation?._id) ||
    getIdValue(conversation?.id) ||
    getIdValue(data?._id) ||
    getIdValue(data?.id)
  );
};

export function SupportChatModal({
  isOpen,
  onClose,
  ticket,
  onResolve
}: SupportChatModalProps) {
  const [message, setMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [getOrCreateConversation, { isLoading: isCreatingChat }] = useGetOrCreateConversationMutation();
  const [adminStartCustomerConversation, { isLoading: isStartingCustomerChat }] = useAdminStartCustomerConversationMutation();
  const [adminSendMessage, { isLoading: isSendingCustomer }] = useAdminSendMessageMutation();
  const [adminToProvider, { isLoading: isSendingProvider }] = useAdminToProviderMutation();
  const [archiveConversation, { isLoading: isArchiving }] = useArchiveConversationMutation();

  const isSending = isSendingCustomer || isSendingProvider;
  const isStartingChat = isCreatingChat || isStartingCustomerChat;
  const targetId = getTicketTargetId(ticket);
  const isRestaurant = isRestaurantTicket(ticket);

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    refetch: refetchMessages
  } = useGetMessagesQuery(
    { conversationId: conversationId! },
    { skip: !conversationId, pollingInterval: 3000 }
  );

  useEffect(() => {
    let shouldIgnore = false;

    if (!isOpen || !ticket) {
      setConversationId(null);
      setMessage('');
      return () => {
        shouldIgnore = true;
      };
    }

    const existingConversationId = getConversationId(ticket.conversationId);
    if (existingConversationId) {
      setConversationId(existingConversationId);
      return () => {
        shouldIgnore = true;
      };
    }

    if (!targetId) {
      setConversationId(null);
      return () => {
        shouldIgnore = true;
      };
    }

    const handleInitChat = async () => {
      try {
        const result = isRestaurant
          ? await getOrCreateConversation({ providerId: targetId }).unwrap()
          : await adminStartCustomerConversation({ customerId: targetId }).unwrap();
        const nextConversationId = getConversationId(result);

        if (!shouldIgnore && nextConversationId) {
          setConversationId(nextConversationId);
        }
      } catch (error) {
        console.error("Failed to init chat:", error);
      }
    };

    handleInitChat();

    return () => {
      shouldIgnore = true;
    };
  }, [isOpen, ticket, targetId, isRestaurant, getOrCreateConversation, adminStartCustomerConversation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messagesData]);

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !conversationId || !targetId) return;

    try {
      const payload = {
        receiverId: targetId,
        text: trimmedMessage
      };

      if (isRestaurant) {
        await adminToProvider(payload).unwrap();
      } else {
        await adminSendMessage(payload).unwrap();
      }

      setMessage('');
      refetchMessages();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleMarkResolved = async () => {
    if (!conversationId) return;

    try {
      await archiveConversation({
        conversationId,
        status: 'ARCHIVED'
      }).unwrap();
      if (onResolve) {
        onResolve();
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Failed to resolve conversation:", error);
    }
  };


  if (!ticket) return null;

  const chatMessages = Array.isArray(messagesData?.data?.messages)
    ? messagesData.data.messages
    : [];
  const currentUserId = getIdValue(currentUser?.id) || getIdValue(currentUser?._id);
  const modalTitle = ticket.source === 'chat'
    ? `${ticket.userName || 'Customer'} - Customer Chat`
    : `Ticket #${ticket.id} - ${ticket.subject}`;

  return <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} size="lg">
    <div className="flex flex-col h-[600px]">
      <div className="bg-gray-200/50 backdrop-blur-sm p-4 rounded-2xl mb-4 flex justify-between items-center border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100">
            <User className="h-6 w-6 text-[#E4983A]" />
          </div>
          <div>
            <p className="font-bold text-gray-900 group">
              {ticket.userName || ticket.user || ticket.userId || "Unknown User"}
              <span className="ml-2 text-[10px] text-gray-400 font-normal">({targetId || 'No user id'})</span>
            </p>
            <p className="text-xs font-medium text-gray-500 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${ticket.status === 'Open' ? 'bg-red-500' : 'bg-green-500'}`} />
              {ticket.userType || ticket.type} - {ticket.status}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          leftIcon={isArchiving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
          onClick={handleMarkResolved}
          disabled={isArchiving || !conversationId}
          className="rounded-xl"
        >
          {isArchiving ? 'Resolving...' : 'Mark Resolved'}
        </Button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 p-4 mb-4 bg-gray-50/50 rounded-2xl border border-gray-100 scroll-smooth"
      >
        {isLoadingMessages || isStartingChat ? (
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
            const senderId = getIdValue(msg.senderId) || getIdValue(msg.sender?._id) || getIdValue(msg.sender?.id);
            const senderRole = String(msg.sender?.role || msg.senderRole || '').toLowerCase();
            const isTarget = Boolean(targetId && senderId === targetId);
            const isMe = !isTarget ||
              senderRole === 'admin' ||
              msg.sender?.role === 'ADMIN' ||
              senderId === currentUserId;

            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[75%] space-y-1`}>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isMe ? 'text-right text-[#E4983A]/70' : 'text-gray-400'}`}>
                    {isMe ? 'Admin' : ticket.userType || 'Customer'}
                  </p>
                  <div className={`p-4 rounded-2xl shadow-sm ${isMe
                    ? 'bg-[#E4983A] text-white rounded-tr-none'
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                    }`}>
                    {msg.attachmentUrl && (
                      <img src={msg.attachmentUrl} alt="attachment" className="rounded-lg mb-2 max-h-48 w-full object-cover" />
                    )}
                    <p className="text-[14px] leading-relaxed font-medium">{msg.content || msg.text}</p>
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isMe ? 'text-right text-[#E4983A]/50' : 'text-gray-400'}`}>
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
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          disabled={isSending || !conversationId || !targetId}
        />
        <Button
          onClick={handleSend}
          disabled={isSending || !message.trim() || !conversationId || !targetId}
          className="rounded-xl px-6"
          leftIcon={isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        >
          {isSending ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  </Modal>;
}
