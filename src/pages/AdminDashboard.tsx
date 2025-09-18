import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LayoutDashboard, Package, Users, TrendingUp, Edit } from "lucide-react";

interface Order {
  id: string;
  ticketId: string;
  name: string;
  phone: string;
  email?: string;
  clothesType: string;
  quantity: number;
  dropoffDate: string;
  status: "Received" | "In Progress" | "Ready" | "Collected";
  notes?: string;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  
  // Mock data for demo
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      ticketId: "LMS-123456",
      name: "John Doe",
      phone: "+1234567890",
      email: "john@example.com",
      clothesType: "Shirts",
      quantity: 5,
      dropoffDate: "2024-01-15",
      status: "Ready",
      notes: "Starch on collars"
    },
    {
      id: "2",
      ticketId: "LMS-789012",
      name: "Jane Smith",
      phone: "+1987654321",
      clothesType: "Suits",
      quantity: 2,
      dropoffDate: "2024-01-16",
      status: "In Progress",
      notes: "Dry clean only"
    },
    {
      id: "3",
      ticketId: "LMS-345678",
      name: "Mike Johnson",
      phone: "+1122334455",
      email: "mike@example.com",
      clothesType: "Casual Wear",
      quantity: 8,
      dropoffDate: "2024-01-17",
      status: "Received",
      notes: ""
    },
    {
      id: "4",
      ticketId: "LMS-901234",
      name: "Sarah Wilson",
      phone: "+1555666777",
      clothesType: "Dresses",
      quantity: 3,
      dropoffDate: "2024-01-14",
      status: "Collected",
      notes: "Handle with care"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Received":
        return "bg-status-received text-white";
      case "In Progress":
        return "bg-status-progress text-white";
      case "Ready":
        return "bg-status-ready text-white";
      case "Collected":
        return "bg-status-collected text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Order status has been updated to ${newStatus}.`
    });
  };

  const stats = {
    totalOrders: orders.length,
    activeOrders: orders.filter(o => o.status !== "Collected").length,
    readyOrders: orders.filter(o => o.status === "Ready").length,
    todayOrders: orders.filter(o => o.dropoffDate === "2024-01-17").length
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage and track all laundry orders</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-gradient-primary text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
            <Package className="w-8 h-8 opacity-75" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-secondary text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Orders</p>
              <p className="text-2xl font-bold">{stats.activeOrders}</p>
            </div>
            <Users className="w-8 h-8 opacity-75" />
          </div>
        </Card>
        
        <Card className="p-6 bg-status-ready text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Ready for Pickup</p>
              <p className="text-2xl font-bold">{stats.readyOrders}</p>
            </div>
            <TrendingUp className="w-8 h-8 opacity-75" />
          </div>
        </Card>
        
        <Card className="p-6 bg-status-progress text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Today's Orders</p>
              <p className="text-2xl font-bold">{stats.todayOrders}</p>
            </div>
            <Package className="w-8 h-8 opacity-75" />
          </div>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="shadow-elegant border-0">
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Clothes</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Drop-off Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.ticketId}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.name}</p>
                        {order.notes && (
                          <p className="text-xs text-muted-foreground truncate max-w-32">
                            {order.notes}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{order.phone}</p>
                        {order.email && (
                          <p className="text-muted-foreground">{order.email}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{order.clothesType}</TableCell>
                    <TableCell>{order.quantity} items</TableCell>
                    <TableCell>
                      {new Date(order.dropoffDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value: Order["status"]) => 
                          updateOrderStatus(order.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Received">Received</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Ready">Ready</SelectItem>
                          <SelectItem value="Collected">Collected</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Backend Notice */}
      <Card className="mt-8 bg-accent/50">
        <CardContent className="p-6">
          <h4 className="font-medium mb-2 flex items-center space-x-2">
            <Edit className="w-5 h-5" />
            <span>Backend Integration Required</span>
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            This is a frontend demo. To enable full functionality including data persistence, 
            authentication, and real-time updates, connect your project to Supabase.
          </p>
          <p className="text-xs text-muted-foreground">
            Features available with Supabase: User authentication, order database, 
            status updates, email notifications, and more.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;