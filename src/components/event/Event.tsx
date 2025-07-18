'use client';

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";

// Define types for our dropdown options
type DropdownOption = {
  id: number;
  name: string;
  icon?: string;
};

type EventTypeOption = DropdownOption & {
  events?: DropdownOption[];
};

type ChainOption = DropdownOption & {
  eventTypes?: EventTypeOption[];
};

export default function Event() {
  // Sample data structure with chains, their event types, and specific events
  const chains: ChainOption[] = [
    {
      id: 1,
      name: "Ethereum",
      icon: "🟢",
      eventTypes: [
        {
          id: 1,
          name: "DeFi",
          events: [
            { id: 1, name: "Uniswap Swap" },
            { id: 2, name: "Aave Loan" },
          ],
        },
        {
          id: 2,
          name: "NFT",
          events: [
            { id: 3, name: "OpenSea Sale" },
            { id: 4, name: "Mint" },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Polygon",
      icon: "🟣",
      eventTypes: [
        {
          id: 3,
          name: "Gaming",
          events: [
            { id: 5, name: "Item Purchase" },
            { id: 6, name: "Level Up" },
          ],
        },
        {
          id: 4,
          name: "Social",
          events: [
            { id: 7, name: "Post Created" },
            { id: 8, name: "Comment Added" },
          ],
        },
      ],
    },
  ];

  // State for selected options
  const [selectedChain, setSelectedChain] = React.useState<ChainOption | null>(null);
  const [selectedEventType, setSelectedEventType] = React.useState<EventTypeOption | null>(null);
  const [selectedEvent, setSelectedEvent] = React.useState<DropdownOption | null>(null);

  // Update event types when chain changes
  React.useEffect(() => {
    setSelectedEventType(null);
    setSelectedEvent(null);
  }, [selectedChain]);

  // Update events when event type changes
  React.useEffect(() => {
    setSelectedEvent(null);
  }, [selectedEventType]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Event" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px]">
          <div className="space-y-6">
            {/* Chain Dropdown */}
            <div>
              <label htmlFor="chain-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Blockchain
              </label>
              <select
                id="chain-select"
                value={selectedChain?.id || ""}
                onChange={(e) => {
                  const selected = chains.find(chain => chain.id === Number(e.target.value));
                  setSelectedChain(selected || null);
                }}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              >
                <option value="">Select a chain</option>
                {chains.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.icon} {chain.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Event Type Dropdown (only shows when chain is selected) */}
            {selectedChain && (
              <div>
                <label htmlFor="event-type-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Event Type
                </label>
                <select
                  id="event-type-select"
                  value={selectedEventType?.id || ""}
                  onChange={(e) => {
                    const selected = selectedChain.eventTypes?.find(
                      type => type.id === Number(e.target.value)
                    );
                    setSelectedEventType(selected || null);
                  }}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                  >
                    <option value="">Select an event type</option>
                    {selectedChain.eventTypes?.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
              </div>
            )}

            {/* Event Dropdown (only shows when event type is selected) */}
            {selectedEventType && (
              <div>
                <label htmlFor="event-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Event
                </label>
                <select
                  id="event-select"
                  value={selectedEvent?.id || ""}
                  onChange={(e) => {
                    const selected = selectedEventType.events?.find(
                      event => event.id === Number(e.target.value)
                    );
                    setSelectedEvent(selected || null);
                  }}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                >
                  <option value="">Select an event</option>
                  {selectedEventType.events?.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Display selection summary */}
            {(selectedChain || selectedEventType || selectedEvent) && (
              <div className="mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Options:</h4>
                {selectedChain && (
                  <p className="text-gray-700 dark:text-gray-300">
                    Chain: <span className="font-semibold">{selectedChain.icon} {selectedChain.name}</span>
                  </p>
                )}
                {selectedEventType && (
                  <p className="text-gray-700 dark:text-gray-300">
                    Event Type: <span className="font-semibold">{selectedEventType.name}</span>
                  </p>
                )}
                {selectedEvent && (
                  <p className="text-gray-700 dark:text-gray-300">
                    Event: <span className="font-semibold">{selectedEvent.name}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}