import { useEffect, useState } from "react";
import { supabase, LaundryOrder } from "./supabaseClient";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<LaundryOrder[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("laundry_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setOrders(data as LaundryOrder[]);
  }

  async function updateStatus(id: number, newStatus: string) {
    await supabase.from("laundry_orders").update({ status: newStatus }).eq("id", id);
    fetchOrders();
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      {orders.map((order) => (
        <div key={order.id} className="border rounded p-4 mb-4 shadow">
          <p>
            <strong>{order.name}</strong> - {order.contact}
          </p>
          <p>Clothes: {order.clothes}</p>
          <p>Status: {order.status}</p>
          <div className="space-x-2 mt-2">
            <button
              onClick={() => updateStatus(order.id, "In Progress")}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              In Progress
            </button>
            <button
              onClick={() => updateStatus(order.id, "Ready")}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Ready
            </button>
            <button
              onClick={() => updateStatus(order.id, "Collected")}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              Collected
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
