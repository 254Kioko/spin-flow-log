import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Package, Clock, CheckCircle2, Truck } from "lucide-react";

interface OrderStatus {
  ticketId: string;
  name: string;
  phone: string;
  clothesType: string;
  quantity: number;
  dropoffDate: string;
  status: "Received" | "In Progress" | "Ready" | "Collected";
  notes?: string;
}

const TrackOrder = () => {
  const { toast } = useToast();
  const [ticketNumber, setTicketNumber] = useState("");
  const [orderData, setOrderData] = useState<OrderStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demo
  const mockOrders: Record<string, OrderStatus> = {
    "LMS-123456": {
      ticketId: "LMS-123456",
      name: "John Doe",
      phone: "+1234567890",
      clothesType: "Shirts",
      quantity: 5,
      dropoffDate: "2024-01-15",
      status: "Ready",
      notes: "Starch on collars"
    },
    "LMS-789012": {
      ticketId: "LMS-789012",
      name: "Jane Smith",
      phone: "+1987654321",
      clothesType: "Suits",
      quantity: 2,
      dropoffDate: "2024-01-16",
      status: "In Progress",
      notes: "Dry clean only"
    }
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Received":
        return <Package className="w-4 h-4" />;
      case "In Progress":
        return <Clock className="w-4 h-4" />;
      case "Ready":
        return <CheckCircle2 className="w-4 h-4" />;
      case "Collected":
        return <Truck className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticketNumber.trim()) {
      toast({
        title: "Missing Ticket Number",
        description: "Please enter your ticket number to track your order.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const order = mockOrders[ticketNumber.toUpperCase()];
      
      if (order) {
        setOrderData(order);
        toast({
          title: "Order Found!",
          description: "Your order details are displayed below."
        });
      } else {
        setOrderData(null);
        toast({
          title: "Order Not Found",
          description: "Please check your ticket number and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Tracking Failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Track Your Order</h1>
          <p className="text-muted-foreground">
            Enter your ticket number to check the status of your laundry order
          </p>
        </div>

        {/* Search Form */}
        <Card className="shadow-elegant border-0 mb-8">
          <CardHeader>
            <CardTitle>Order Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrackOrder} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ticketNumber" className="flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Ticket Number</span>
                </Label>
                <Input
                  id="ticketNumber"
                  type="text"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  placeholder="Enter your ticket number (e.g., LMS-123456)"
                  className="text-center text-lg font-mono"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-hero hover:opacity-90 text-white font-medium py-3"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Tracking Order...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Track Order
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Order Details */}
        {orderData && (
          <Card className="shadow-elegant border-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Order Details</span>
                <Badge className={getStatusColor(orderData.status)}>
                  {getStatusIcon(orderData.status)}
                  <span className="ml-2">{orderData.status}</span>
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">Ticket ID</Label>
                    <p className="font-mono text-lg">{orderData.ticketId}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Customer Name</Label>
                    <p className="font-medium">{orderData.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Phone Number</Label>
                    <p>{orderData.phone}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">Clothes Type</Label>
                    <p className="font-medium">{orderData.clothesType}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Quantity</Label>
                    <p>{orderData.quantity} items</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Drop-off Date</Label>
                    <p>{new Date(orderData.dropoffDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              {orderData.notes && (
                <div>
                  <Label className="text-sm text-muted-foreground">Special Notes</Label>
                  <p className="bg-muted p-3 rounded-md">{orderData.notes}</p>
                </div>
              )}

              {/* Status Timeline */}
              <div className="mt-6 pt-6 border-t">
                <Label className="text-sm text-muted-foreground mb-4 block">Order Progress</Label>
                <div className="space-y-3">
                  {["Received", "In Progress", "Ready", "Collected"].map((status, index) => {
                    const isCompleted = ["Received", "In Progress", "Ready", "Collected"].indexOf(orderData.status) >= index;
                    const isCurrent = status === orderData.status;
                    
                    return (
                      <div key={status} className={`flex items-center space-x-3 ${isCompleted ? "text-primary" : "text-muted-foreground"}`}>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isCompleted ? "bg-primary" : "bg-muted"}`}>
                          {isCompleted && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className={`${isCurrent ? "font-bold" : ""}`}>{status}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Demo Instructions */}
        <Card className="mt-8 bg-accent/50">
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">Demo Instructions</h4>
            <p className="text-sm text-muted-foreground">
              Try these demo ticket numbers: <span className="font-mono">LMS-123456</span> or <span className="font-mono">LMS-789012</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackOrder;