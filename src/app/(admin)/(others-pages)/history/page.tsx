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
        <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Completed Activities</h2>
        <p className="text-gray-600 dark:text-white mb-4">
          On this page, users, admins, and super admins can view the history of
          completed activities. If an activity is not completed, it will appear
          in the Progress menu.
        </p>
        {completedActivities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 text-left text-black dark:text-white">
                  <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700">ID</th>
                  <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700">Title</th>
                  <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700">Date</th>
                  <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {completedActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-black dark:text-white">{activity.id}</td>
                    <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-black dark:text-white">{activity.title}</td>
                    <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-black dark:text-white">{activity.date}</td>
                    <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-green-600 dark:text-green-400">{activity.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-white">No completed activities found.</p>
        )}
      </div>
    </div>
  );
}