"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function KOTView({
  tableNumber,
  orders,
  onPrint,
  onViewBill,
  onBack,
}) {
  const currentTime = new Date().toLocaleString();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        {/* Screen View */}
        <div className="no-print mb-8">
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onBack}>
              Back to Order
            </Button>
            <Button onClick={onPrint}>Print KOT</Button>
            <Button onClick={onViewBill} className="bg-primary">
              View Bill
            </Button>
          </div>
        </div>

        {/* KOT Document */}
        <div className="print-page bg-card text-card-foreground border-2 border-border">
          <Card className="border-4 border-border p-8">
            {/* KOT Header */}
            <div className="text-center mb-8 border-b-2 border-border pb-6">
              <h1 className="text-3xl font-bold">KITCHEN ORDER TICKET</h1>
              <p className="text-lg font-semibold text-primary mt-2">KOT</p>
            </div>

            {/* Restaurant Info */}
            <div className="text-center mb-8 pb-6 border-b border-border">
              <p className="text-sm font-medium">Restaurant Name</p>
              <p className="text-xs text-muted-foreground">
                Address: City, Country
              </p>
              <p className="text-xs text-muted-foreground">
                Phone: +91 XXXXXXXXXX
              </p>
            </div>

            {/* Order Details */}
            <div className="mb-8 pb-6 border-b border-border">
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold">TABLE NO:</p>
                  <p className="text-2xl font-bold">{tableNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold">KOT TIME:</p>
                  <p className="text-sm">{currentTime}</p>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="mb-8 pb-6 border-b-2 border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-bold">ITEM</th>
                    <th className="text-center py-2 font-bold">QTY</th>
                    <th className="text-right py-2 font-bold">REMARKS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((item) => (
                    <tr key={item.id} className="border-b border-muted">
                      <td className="py-3 font-semibold">
                        {item.name.toUpperCase()}
                      </td>
                      <td className="text-center py-3 text-lg font-bold">
                        {item.quantity}
                      </td>
                      <td className="text-right py-3 text-xs">_____</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-xs mb-2">Chef Signature: _____________</p>
              <p className="text-xs">
                Date: {new Date().toLocaleDateString()}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

