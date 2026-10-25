import React from "react";

interface NotificationProps {
  notification_id: string;
  incident_id: string;
  message: string;
  hint?: string;
}

const NotificationCard: React.FC<NotificationProps> = ({ notification_id, incident_id, message, hint }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-white mb-4">
      <h2 className="text-xl font-bold">Notification {notification_id}</h2>
      <p className="text-gray-300">Incident {incident_id}</p>
      <p className="mt-2">{message}</p>
      {hint && <p className="mt-3 text-sm text-cyan-300">{hint}</p>}
    </div>
  );
};

export default NotificationCard;
