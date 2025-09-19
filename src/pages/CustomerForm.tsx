import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shirt, Phone, Mail, Package, FileText } from "lucide-react";

const CustomerForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    clothesType: "",
    quantity: "",
    notes: ""
  });

  const clothesTypes = [
    "Shirts",
    "Trousers",
    "Jackets",
    "Dresses",
    "Suits",
    "Casual Wear",
    "Formal Wear",
    "Delicate Items",
    "Blankets",
    "Curtains"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.fullName || !formData.phone || !formData.clothesType || !formData.quantity) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("laundry_orders")
        .insert([
          {
            name: formData.fullName,
            contact: formData.phone,
            clothes: `${formData.clothesType} (${formData.quantity} items)${formData.notes ? ` - ${formData.notes}` : ''}`,
            status: "Pending"
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      // Generate ticket number based on order ID
      const ticketNumber = `LMS-${data[0].id.toString().padStart(6, '0')}`;

      toast({
        title: "Order Submitted Successfully!",
        description: `Your ticket number is: ${ticketNumber}. Save this for tracking.`
      });

      // Reset form
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        clothesType: "",
        quantity: "",
        notes: ""
      });

    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
            <Shirt className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Submit Laundry Order</h1>
          <p className="text-muted-foreground">
            Fill out the form below to submit your laundry for professional cleaning
          </p>
        </div>

        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center space-x-2">
                  <Shirt className="w-4 h-4" />
                  <span>Full Name *</span>
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Phone Number *</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              {/* Email (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email (Optional)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>

              {/* Type of Clothes */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>Type of Clothes *</span>
                </Label>
                <Select value={formData.clothesType} onValueChange={(value) => handleInputChange("clothesType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select clothes type" />
                  </SelectTrigger>
                  <SelectContent>
                    {clothesTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity" className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>Quantity *</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  placeholder="Number of items"
                  required
                />
              </div>

              {/* Special Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Special Notes (Optional)</span>
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Any special instructions or notes..."
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-hero hover:opacity-90 text-white font-medium py-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting Order...
                  </>
                ) : (
                  "Submit Laundry Order"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <Card className="p-4 bg-gradient-primary text-white">
            <h3 className="font-semibold mb-1">Quick Service</h3>
            <p className="text-sm opacity-90">Most orders ready within 24-48 hours</p>
          </Card>
          <Card className="p-4 bg-gradient-secondary text-white">
            <h3 className="font-semibold mb-1">Professional Care</h3>
            <p className="text-sm opacity-90">Expert cleaning with premium products</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;