import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js History | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js History page for TailAdmin Tailwind CSS Admin Dashboard Template",
};

export default function HistoryPage() {
  const completedActivities = [
    { id: 1, title: "Meeting with Team", date: "2025-07-28", status: "Completed" },
    { id: 2, title: "Project Review", date: "2025-07-25", status: "Completed" },
    { id: 3, title: "Client Presentation", date: "2025-07-20", status: "Completed" },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="History" />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Completed Activities</h2>
        <p className="text-gray-600 mb-4">
          On this page, users, admins, and super admins can view the history of
          completed activities. If an activity is not completed, it will appear
          in the Progress menu.
        </p>
        {completedActivities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600">
                  <th className="py-3 px-4 border-b">ID</th>
                  <th className="py-3 px-4 border-b">Title</th>
                  <th className="py-3 px-4 border-b">Date</th>
                  <th className="py-3 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {completedActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{activity.id}</td>
                    <td className="py-3 px-4 border-b">{activity.title}</td>
                    <td className="py-3 px-4 border-b">{activity.date}</td>
                    <td className="py-3 px-4 border-b text-green-600">{activity.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No completed activities found.</p>
        )}
      </div>
    </div>
  );
}