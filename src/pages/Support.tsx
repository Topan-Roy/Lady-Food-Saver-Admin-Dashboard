import { useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SupportChatModal } from '../components/modals/SupportChatModal';
import { useGetAdminSupportTicketsQuery } from '../redux/features/chat';
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
  priority: string;
  date: string;
  description: string;
}

export function Support() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: ticketsResponse, isLoading } = useGetAdminSupportTicketsQuery({
    status: 'Open',
    priority: 'Medium',
    page: currentPage,
    limit: 10
  });
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tickets: SupportTicket[] = (ticketsResponse?.data?.tickets || []).map((t: any) => {
    const userType = t["User Type"] || t.userType || '';
    const normalizedUserType = String(userType).toLowerCase();
    const customerId =
      t.userID ||
      t.customerId ||
      t.customer?._id ||
      t.customer?.id ||
      t.user?._id ||
      t.user?.id ||
      t.userId?._id ||
      t.userId?.id;
    const providerId =
      t.userID ||
      t.providerId ||
      t.provider?._id ||
      t.provider?.id ||
      t.restaurant?._id ||
      t.restaurant?.id;
    const resolvedUserId = normalizedUserType === 'restaurant' || normalizedUserType === 'provider'
      ? (providerId || t.userID || t.userId || t._id)
      : (customerId || t.userID || t.userId || t._id);

    return {
      id: t["Ticket ID"] || t.ticketId,
      _id: t.id || t._id,
      conversationId: t.conversationId || t.convershasonId,
      subject: t.Subject || t.subject,
      userName:
        t.User ||
        t.userName ||
        t.customer?.fullName ||
        t.user?.fullName ||
        t.userId?.fullName ||
        t.provider?.restaurantsName ||
        t.provider?.restaurantName ||
        t.restaurant?.restaurantsName ||
        t.restaurant?.restaurantName ||
        "Unknown",
      userID: resolvedUserId,
      customerId,
      providerId,
      userType,
      status: t.Status || t.status,
      priority: t.Priority || t.priority,
      date: t.Date ? formatDistanceToNow(new Date(t.Date), { addSuffix: true }) :
        (t.createdAt ? formatDistanceToNow(new Date(t.createdAt), { addSuffix: true }) : 'N/A'),
      description: t.Description || t.description
    };
  });

  const openChat = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleResolveTicket = () => {
    // This will be implemented with a mutation later if needed
    setIsModalOpen(false);
  };

  return <AdminLayout>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Support Tickets
          </h1>
          <p className="text-gray-500">
            Manage customer and restaurant inquiries
          </p>
        </div>
      </div>

      <Table
        isLoading={isLoading}
        data={tickets}
        currentPage={currentPage}
        totalPages={ticketsResponse?.data?.meta?.totalPages || 1}
        totalResults={ticketsResponse?.data?.meta?.total || 0}
        onPageChange={(page) => setCurrentPage(page)}
        columns={[{
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
