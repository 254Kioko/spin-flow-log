import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function LaundryForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [clothes, setClothes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("laundry_orders").insert([
      {
        name,
        contact,
        clothes,
      },
    ]);

    if (error) {
      alert("❌ Error saving order: " + error.message);
    } else {
      alert("✅ Order saved successfully!");
      setName("");
      setContact("");
      setClothes("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        className="border p-2 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        className="border p-2 w-full"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="Contact"
        required
      />
      <textarea
        className="border p-2 w-full"
        value={clothes}
        onChange={(e) => setClothes(e.target.value)}
        placeholder="Clothes info"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}
