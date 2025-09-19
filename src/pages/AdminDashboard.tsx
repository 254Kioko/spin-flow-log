import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Package, Users, TrendingUp, Edit } from "lucide-react";

interface Order {
  id: number;
  ticketId: string;
  name: string;
  contact: string;
  clothes: string;
  created_at: string;
  status: "Pending" | "In Progress" | "Ready" | "Collected";
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from("laundry_orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedOrders = data?.map(order => ({
        id: order.id,
        ticketId: `LMS-${order.id.toString().padStart(6, '0')}`,
        name: order.name,
        contact: order.contact,
        clothes: order.clothes || "",
        created_at: order.created_at || "",
        status: (order.status as Order["status"]) || "Pending"
      })) || [];

      setOrders(formattedOrders);
    } catch (error: any) {
      toast({
        title: "Error Loading Orders",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
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

  const updateOrderStatus = async (orderId: number, newStatus: Order["status"]) => {
    try {
      const { error } = await supabase
        .from("laundry_orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      toast({
        title: "Status Updated",
        description: `Order status has been updated to ${newStatus}.`
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const stats = {
    totalOrders: orders.length,
    activeOrders: orders.filter(o => o.status !== "Collected").length,
    readyOrders: orders.filter(o => o.status === "Ready").length,
    todayOrders: orders.filter(o => {
      const today = new Date().toDateString();
      return new Date(o.created_at).toDateString() === today;
    }).length
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

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
                  <TableHead>Order Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.ticketId}</TableCell>
                    <TableCell>
                      <p className="font-medium">{order.name}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{order.contact}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{order.clothes}</p>
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
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
                          <SelectItem value="Pending">Pending</SelectItem>
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

      {orders.length === 0 && (
        <Card className="mt-8 bg-accent/50">
          <CardContent className="p-6 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h4 className="font-medium mb-2">No Orders Yet</h4>
            <p className="text-sm text-muted-foreground">
              Orders will appear here once customers start submitting them through the customer form.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;