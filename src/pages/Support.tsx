import { useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SupportChatModal } from '../components/modals/SupportChatModal';
import {
  useGetAdminCustomerConversationsQuery,
  useGetAdminSupportTicketsQuery
} from '../redux/features/chat';
import { formatDistanceToNow } from 'date-fns';

interface SupportTicket {
  id: string; // display ticketId
  _id: string; // internal mongodb id
  conversationId?: string;
  subject: string;
  userName: string; // display name
  userID: string; // actual database id
  customerId?: string;
  providerId?: string;
  userType: string;
  status: string;
  priority?: string;
  date: string;
  description: string;
  lastMessage?: string;
  source: 'ticket' | 'chat';
}

const getIdValue = (...values: any[]) => {
  for (const value of values) {
    if (!value) continue;

    if (typeof value === 'string' || typeof value === 'number') {
      return String(value);
    }

    if (typeof value === 'object') {
      const nestedId = value._id || value.id;
      if (nestedId) return String(nestedId);
    }
  }

  return '';
};

const getArrayValue = (...values: any[]) => {
  for (const value of values) {
    if (Array.isArray(value)) return value;
  }

  return [];
};

const isProviderUserType = (userType: string) => {
  const normalizedUserType = String(userType || '').toLowerCase();
  return normalizedUserType === 'restaurant' || normalizedUserType === 'provider';
};

const getNestedUser = (...values: any[]) => {
  for (const value of values) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value;
    }
  }

  return null;
};

const getUserName = (user: any) => {
  if (!user || typeof user !== 'object') return '';

  return (
    user.fullName ||
    user.name ||
    user.userName ||
    user.email ||
    user.phone ||
    ''
  );
};

const getMessageText = (message: any) => {
  if (!message) return '';
  if (typeof message === 'string') return message;

  return (
    message.text ||
    message.content ||
    message.message ||
    message.body ||
    ''
  );
};

const formatRelativeDate = (...values: any[]) => {
  for (const value of values) {
    if (!value) continue;

    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
  }

  return 'N/A';
};

const getResponseList = (response: any, keys: string[]) => {
  const data = response?.data;

  return getArrayValue(
    ...keys.map((key) => data?.[key]),
    ...keys.map((key) => response?.[key]),
    data,
    response
  );
};

const getResponseMeta = (response: any) => {
  const data = response?.data;

  return (
    data?.meta ||
    data?.pagination ||
    data?.pageInfo ||
    response?.meta ||
    response?.pagination ||
    response?.pageInfo ||
    {}
  );
};

const getTotalPages = (meta: any) => {
  return meta?.totalPages || meta?.totalPage || meta?.pages || meta?.pageCount || 1;
};

const getTotalResults = (meta: any, fallbackCount: number) => {
  return meta?.total || meta?.totalResults || meta?.totalDocs || meta?.count || fallbackCount;
};

export function Support() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeView, setActiveView] = useState<'tickets' | 'customerChats'>('tickets');
  const isCustomerChatView = activeView === 'customerChats';

  const {
    data: ticketsResponse,
    isLoading: isTicketsLoading,
    refetch: refetchTickets
  } = useGetAdminSupportTicketsQuery({
    status: 'Open',
    priority: 'Medium',
    page: currentPage,
    limit: 10
  }, {
    skip: isCustomerChatView
  });
  const {
    data: conversationsResponse,
    isLoading: isConversationsLoading,
    refetch: refetchConversations
  } = useGetAdminCustomerConversationsQuery({
    page: currentPage,
    limit: 10
  }, {
    skip: !isCustomerChatView
  });
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const supportTickets = getResponseList(ticketsResponse, ['tickets', 'supportTickets', 'results', 'docs']);
  const conversations = getResponseList(conversationsResponse, ['conversations', 'customerConversations', 'chats', 'results', 'docs']);

  const tickets: SupportTicket[] = supportTickets.map((ticket: any) => {
    const userType = ticket["User Type"] || ticket.userType || '';
    const customerId = getIdValue(
      ticket.customerId,
      ticket["Customer ID"],
      ticket.userID,
      ticket["User ID"],
      ticket.userId,
      ticket.customer?._id,
      ticket.customer?.id,
      ticket.user?._id,
      ticket.user?.id
    );
    const providerId = getIdValue(
      ticket.providerId,
      ticket["Provider ID"],
      ticket["Restaurant ID"],
      ticket.userID,
      ticket["User ID"],
      ticket.userId,
      ticket.provider?._id,
      ticket.provider?.id,
      ticket.restaurant?._id,
      ticket.restaurant?.id
    );
    const resolvedUserId = isProviderUserType(userType) ? providerId : customerId;

    return {
      id: ticket["Ticket ID"] || ticket.ticketId,
      _id: getIdValue(ticket.id, ticket._id),
      conversationId: getIdValue(ticket.conversationId, ticket.convershasonId, ticket.conversation),
      subject: ticket.Subject || ticket.subject || 'Support Ticket',
      userName:
        ticket.User ||
        ticket.userName ||
        ticket.customer?.fullName ||
        ticket.user?.fullName ||
        ticket.userId?.fullName ||
        ticket.provider?.restaurantsName ||
        ticket.provider?.restaurantName ||
        ticket.restaurant?.restaurantsName ||
        ticket.restaurant?.restaurantName ||
        'Unknown',
      userID: resolvedUserId,
      customerId,
      providerId,
      userType,
      status: ticket.Status || ticket.status || 'Open',
      priority: ticket.Priority || ticket.priority || 'Normal',
      date: formatRelativeDate(ticket.Date, ticket.createdAt, ticket.updatedAt),
      description: ticket.Description || ticket.description || '',
      source: 'ticket'
    };
  });

  const customerChats: SupportTicket[] = conversations.map((conversation: any) => {
    const customer = getNestedUser(
      conversation.customer,
      conversation.customerId,
      conversation.user,
      conversation.userId,
      conversation.participant,
      conversation.participants?.find((participant: any) => {
        const role = String(participant?.role || participant?.userType || '').toLowerCase();
        return role === 'customer' || role === 'user';
      })
    );
    const lastMessage = conversation.lastMessage || conversation.latestMessage || conversation.message;
    const conversationId = getIdValue(conversation.conversationId, conversation.id, conversation._id);
    const customerId = getIdValue(
      conversation.customerId,
      conversation.customer?._id,
      conversation.customer?.id,
      conversation.userID,
      conversation.userId,
      conversation.user?._id,
      conversation.user?.id,
      customer?._id,
      customer?.id
    );
    const unreadCount = conversation.unreadCount || conversation.unreadMessages || conversation.unread || 0;
    const status = conversation.status || (Number(unreadCount) > 0 ? 'Unread' : 'Active');
    const messageText = getMessageText(lastMessage) || conversation.description || 'No messages yet';

    return {
      id: conversation.ticketId || `CHAT-${conversationId.slice(-6) || customerId.slice(-6) || 'NEW'}`,
      _id: conversationId,
      conversationId,
      subject: 'Customer Chat',
      userName:
        getUserName(customer) ||
        conversation.customerName ||
        conversation.userName ||
        'Unknown Customer',
      userID: customerId,
      customerId,
      userType: 'Customer',
      status,
      date: formatRelativeDate(
        conversation.updatedAt,
        lastMessage?.createdAt,
        conversation.lastMessageAt,
        conversation.createdAt
      ),
      description: messageText,
      lastMessage: messageText,
      source: 'chat'
    };
  });

  const tableData = isCustomerChatView ? customerChats : tickets;
  const activeResponse = isCustomerChatView ? conversationsResponse : ticketsResponse;
  const activeMeta = getResponseMeta(activeResponse);
  const isLoading = isCustomerChatView ? isConversationsLoading : isTicketsLoading;

  const switchView = (view: 'tickets' | 'customerChats') => {
    setActiveView(view);
    setCurrentPage(1);
  };

  const openChat = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleResolveTicket = () => {
    if (isCustomerChatView) {
      refetchConversations();
    } else {
      refetchTickets();
    }
    setIsModalOpen(false);
  };

  return <AdminLayout>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Support
          </h1>
          <p className="text-gray-500">
            Manage support tickets and customer conversations
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={activeView === 'tickets' ? 'primary' : 'secondary'}
            onClick={() => switchView('tickets')}
          >
            Tickets
          </Button>
          <Button
            size="sm"
            variant={activeView === 'customerChats' ? 'primary' : 'secondary'}
            onClick={() => switchView('customerChats')}
          >
            Customer Chats
          </Button>
        </div>
      </div>

      <Table
        isLoading={isLoading}
        data={tableData}
        currentPage={currentPage}
        totalPages={getTotalPages(activeMeta)}
        totalResults={getTotalResults(activeMeta, tableData.length)}
        onPageChange={(page) => setCurrentPage(page)}
        columns={isCustomerChatView ? [{
          header: 'Chat ID',
          accessorKey: 'id',
          className: 'font-medium'
        }, {
          header: 'Customer',
          accessorKey: 'userName'
        }, {
          header: 'Last Message',
          cell: (item: SupportTicket) => <span className="block max-w-[280px] truncate">
            {item.lastMessage || item.description}
          </span>
        }, {
          header: 'Status',
          cell: (item: SupportTicket) => <Badge variant={item.status === 'Unread' ? 'warning' : 'success'}>
            {item.status}
          </Badge>
        }, {
          header: 'Updated',
          accessorKey: 'date'
        }, {
          header: 'Actions',
          cell: (item: SupportTicket) => <Button size="sm" variant="secondary" onClick={() => openChat(item)}>
            View
          </Button>
        }] : [{
          header: 'Ticket ID',
          accessorKey: 'id',
          className: 'font-medium'
        }, {
          header: 'Subject',
          accessorKey: 'subject'
        }, {
          header: 'User Type',
          cell: (item: SupportTicket) => <Badge variant="outline">{item.userType}</Badge>
        }, {
          header: 'User',
          accessorKey: 'userName'
        }, {
          header: 'Priority',
          cell: (item: SupportTicket) => <span className={`font-medium ${item.priority === 'High' ? 'text-red-600' : item.priority === 'Medium' ? 'text-yellow-600' : 'text-blue-600'}`}>
            {item.priority}
          </span>
        }, {
          header: 'Status',
          cell: (item: SupportTicket) => <Badge variant={item.status === 'Resolved' ? 'success' : item.status === 'Open' ? 'error' : 'warning'}>
            {item.status}
          </Badge>
        }, {
          header: 'Date',
          accessorKey: 'date'
        }, {
          header: 'Actions',
          cell: (item: SupportTicket) => <Button size="sm" variant="secondary" onClick={() => openChat(item)}>
            View
          </Button>
        }]} />
    </div>

    <SupportChatModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      ticket={selectedTicket}
      onResolve={handleResolveTicket}
    />
  </AdminLayout>;
}
