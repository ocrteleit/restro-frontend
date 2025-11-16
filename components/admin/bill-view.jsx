"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function BillView({ tableNumber, orders, onPrint, onBack }) {
  const currentTime = new Date().toLocaleString();

  const subtotal = orders.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        {/* Screen View */}
        <div className="no-print mb-8">
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button onClick={onPrint}>Print Bill</Button>
          </div>
        </div>

        {/* Bill Document */}
        <div className="print-page bg-card text-card-foreground border-2 border-border">
          <Card className="border-4 border-border p-8 font-mono">
            {/* Header */}
            <div className="text-center mb-6 border-b-2 border-border pb-6">
              <h1 className="text-3xl font-bold">INVOICE</h1>
              <p className="text-primary font-bold text-lg mt-2">TAX INVOICE</p>
            </div>

            {/* Restaurant Info */}
            <div className="text-center mb-6 pb-4 border-b border-border">
              <p className="font-bold">Your Restaurant Name</p>
              <p className="text-sm">Address: City, Country</p>
              <p className="text-sm">Phone: +91 XXXXXXXXXX</p>
              <p className="text-sm">GST: 18AABCT0001H1Z0</p>
            </div>

            {/* Invoice Details */}
            <div className="mb-6 pb-4 border-b border-border">
              <div className="flex justify-between text-sm">
                <div>
                  <p className="font-semibold">
                    Invoice No: INV-{Math.floor(Math.random() * 10000)}
                  </p>
                  <p className="font-semibold">Table: {tableNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    Date: {new Date().toLocaleDateString()}
                  </p>
                  <p className="font-semibold">
                    Time: {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-6 pb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left py-2">ITEM</th>
                    <th className="text-center py-2">QTY</th>
                    <th className="text-right py-2">RATE</th>
                    <th className="text-right py-2">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((item) => (
                    <tr key={item.id} className="border-b border-muted">
                      <td className="py-2">{item.name}</td>
                      <td className="text-center py-2">{item.quantity}</td>
                      <td className="text-right py-2">
                        ₹{item.price.toFixed(2)}
                      </td>
                      <td className="text-right py-2 font-semibold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="mb-6 pb-4 border-b-2 border-border">
              <div className="flex justify-end mb-2">
                <div className="w-64">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-border pb-2 mb-2">
                    <span>GST (18%):</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>TOTAL:</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Footer */}
            <div className="text-center border-t-2 border-border pt-4">
              <p className="text-xs mb-3">Thank you for your visit!</p>
              <p className="text-xs text-muted-foreground mb-3">
                Please come again
              </p>
              <p className="text-xs font-semibold">Cashier: ___________</p>
              <p className="text-xs mt-3">Terms & Conditions Apply</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

