"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Vehicle {
  id: number;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  type: string;
  vehicleId: number | null;
  vehicle: Vehicle | null;
  isRead: boolean;
  createdAt: string;
}

const typeLabels: Record<string, string> = {
  general: "General",
  vehicle_inquiry: "Vehicle Inquiry",
  financing: "Financing",
  consignment: "Consignment",
  sell_your_car: "Sell Your Car",
};

const typeColors: Record<string, string> = {
  general: "bg-gray-100 text-gray-800",
  vehicle_inquiry: "bg-blue-100 text-blue-800",
  financing: "bg-green-100 text-green-800",
  consignment: "bg-purple-100 text-purple-800",
  sell_your_car: "bg-orange-100 text-orange-800",
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const fetchContacts = async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (typeFilter !== "all") params.set("type", typeFilter);
    if (readFilter !== "all") params.set("isRead", readFilter === "read" ? "true" : "false");

    const response = await fetch(`/api/contacts?${params}`);
    const data = await response.json();
    setContacts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, [typeFilter, readFilter]);

  const toggleRead = async (contact: Contact) => {
    await fetch("/api/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: contact.id, isRead: !contact.isRead }),
    });
    fetchContacts();
  };

  const deleteContact = async (id: number) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;
    await fetch(`/api/contacts?id=${id}`, { method: "DELETE" });
    setSelectedContact(null);
    fetchContacts();
  };

  const unreadCount = contacts.filter((c) => !c.isRead).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-semibold text-charcoal">
            Contact Submissions
          </h1>
          <p className="text-gray text-sm mt-1">
            {unreadCount > 0 ? (
              <span className="text-gold font-medium">{unreadCount} unread</span>
            ) : (
              "All caught up!"
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-light rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">All Types</option>
          <option value="general">General</option>
          <option value="vehicle_inquiry">Vehicle Inquiry</option>
          <option value="financing">Financing</option>
          <option value="consignment">Consignment</option>
          <option value="sell_your_car">Sell Your Car</option>
        </select>

        <select
          value={readFilter}
          onChange={(e) => setReadFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-light rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
        {/* Contact List */}
        <div className="lg:col-span-2 bg-white rounded-sm shadow-luxury overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray">Loading...</div>
          ) : contacts.length === 0 ? (
            <div className="p-8 text-center text-gray">No contacts found</div>
          ) : (
            <div className="divide-y divide-gray-light/20">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full text-left p-4 hover:bg-off-white transition-colors ${
                    selectedContact?.id === contact.id ? "bg-off-white" : ""
                  } ${!contact.isRead ? "border-l-4 border-gold" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`font-medium ${
                            contact.isRead ? "text-gray" : "text-charcoal"
                          }`}
                        >
                          {contact.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            typeColors[contact.type] || typeColors.general
                          }`}
                        >
                          {typeLabels[contact.type] || contact.type}
                        </span>
                      </div>
                      {contact.vehicle && (
                        <p className="text-sm text-gold mb-1">
                          {contact.vehicle.year} {contact.vehicle.make}{" "}
                          {contact.vehicle.model}
                        </p>
                      )}
                      <p className="text-sm text-gray truncate">{contact.message}</p>
                    </div>
                    <span className="text-xs text-gray whitespace-nowrap">
                      {formatDate(contact.createdAt)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Contact Detail */}
        <div className="bg-white rounded-sm shadow-luxury p-6">
          {selectedContact ? (
            <>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display text-xl font-semibold text-charcoal">
                    {selectedContact.name}
                  </h3>
                  <span
                    className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${
                      typeColors[selectedContact.type] || typeColors.general
                    }`}
                  >
                    {typeLabels[selectedContact.type] || selectedContact.type}
                  </span>
                </div>
                <span className="text-xs text-gray">
                  {formatDate(selectedContact.createdAt)}
                </span>
              </div>

              {selectedContact.vehicle && (
                <div className="bg-off-white p-3 rounded-sm mb-4">
                  <p className="text-xs text-gray uppercase tracking-wide mb-1">
                    Vehicle
                  </p>
                  <Link
                    href={`/inventory/${selectedContact.vehicle.vin}`}
                    className="text-gold hover:underline font-medium"
                  >
                    {selectedContact.vehicle.year} {selectedContact.vehicle.make}{" "}
                    {selectedContact.vehicle.model}
                    {selectedContact.vehicle.trim && ` ${selectedContact.vehicle.trim}`}
                  </Link>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-xs text-gray uppercase tracking-wide mb-1">
                    Email
                  </p>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="text-gold hover:underline"
                  >
                    {selectedContact.email}
                  </a>
                </div>
                {selectedContact.phone && (
                  <div>
                    <p className="text-xs text-gray uppercase tracking-wide mb-1">
                      Phone
                    </p>
                    <a
                      href={`tel:${selectedContact.phone}`}
                      className="text-gold hover:underline"
                    >
                      {selectedContact.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <p className="text-xs text-gray uppercase tracking-wide mb-2">
                  Message
                </p>
                <p className="text-charcoal whitespace-pre-wrap">
                  {selectedContact.message}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleRead(selectedContact)}
                  className="flex-1 px-4 py-2 text-sm border border-gray-light rounded-sm hover:bg-off-white transition-colors"
                >
                  Mark as {selectedContact.isRead ? "Unread" : "Read"}
                </button>
                <button
                  onClick={() => deleteContact(selectedContact.id)}
                  className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-sm hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray py-12">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-light"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <p>Select a contact to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
