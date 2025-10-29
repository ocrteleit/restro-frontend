"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  User,
  Mail,
  Phone,
  ShoppingBag,
  DollarSign,
  Star,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCustomers } from "@/hooks/useAdmin";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { customers, isLoading } = useCustomers();

  const viewCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    setSheetOpen(true);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  // Filter customers
  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase();
    const name = customer.attributes.name?.toLowerCase() || "";
    const phone = customer.attributes.phone?.toLowerCase() || "";
    const email = customer.attributes.email?.toLowerCase() || "";

    return (
      name.includes(searchLower) ||
      phone.includes(searchLower) ||
      email.includes(searchLower)
    );
  });

  // Calculate statistics
  const stats = {
    total: customers.length,
    totalSpent: customers.reduce(
      (sum, c) => sum + (c.attributes.total_spent || 0),
      0
    ),
    totalOrders: customers.reduce(
      (sum, c) => sum + (c.attributes.total_orders || 0),
      0
    ),
    averageSpent:
      customers.length > 0
        ? customers.reduce(
            (sum, c) => sum + (c.attributes.total_spent || 0),
            0
          ) / customers.length
        : 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-500 mt-1">
          Manage customer relationships and loyalty
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalSpent)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.averageSpent)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <Input
          placeholder="Search customers by name, phone, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Contact
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    Orders
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    Total Spent
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    Loyalty Points
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Last Visit
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => {
                    const attrs = customer.attributes;
                    return (
                      <tr
                        key={customer.id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => viewCustomerDetails(customer)}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {attrs.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            {attrs.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-3 h-3" />
                                {attrs.phone}
                              </div>
                            )}
                            {attrs.email && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="w-3 h-3" />
                                {attrs.email}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">
                          {attrs.total_orders || 0}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">
                          {formatCurrency(attrs.total_spent)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Badge variant="secondary">
                            <Star className="w-3 h-3 mr-1" />
                            {attrs.loyalty_points || 0}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {attrs.last_visit
                            ? format(new Date(attrs.last_visit), "MMM dd, yyyy")
                            : "N/A"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Details Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedCustomer && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedCustomer.attributes.name}</SheetTitle>
                <SheetDescription>
                  Customer information and history
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedCustomer.attributes.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {selectedCustomer.attributes.phone}
                        </span>
                      </div>
                    )}
                    {selectedCustomer.attributes.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {selectedCustomer.attributes.email}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Total Orders</span>
                      </div>
                      <span className="font-semibold">
                        {selectedCustomer.attributes.total_orders || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Total Spent</span>
                      </div>
                      <span className="font-semibold">
                        {formatCurrency(
                          selectedCustomer.attributes.total_spent
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Loyalty Points</span>
                      </div>
                      <span className="font-semibold">
                        {selectedCustomer.attributes.loyalty_points || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Last Visit</span>
                      </div>
                      <span className="font-semibold">
                        {selectedCustomer.attributes.last_visit
                          ? format(
                              new Date(selectedCustomer.attributes.last_visit),
                              "MMM dd, yyyy"
                            )
                          : "N/A"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Favorite Items */}
                {selectedCustomer.attributes.favorite_items &&
                  selectedCustomer.attributes.favorite_items.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Favorite Items
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedCustomer.attributes.favorite_items.map(
                            (item, index) => (
                              <Badge key={index} variant="secondary">
                                {item}
                              </Badge>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                {/* Member Since */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Member Since</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      {format(
                        new Date(selectedCustomer.attributes.createdAt),
                        "MMMM dd, yyyy"
                      )}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
