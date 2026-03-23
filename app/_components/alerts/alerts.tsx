import { useAlertStore } from "@/store/alert.store";

export const Alerts = () => {
  const { alerts, removeAlert } = useAlertStore();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`px-4 py-2 rounded shadow ${alert.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
        >
          <div className="flex items-center justify-between">
            <span>{alert.message}</span>
            <button
              onClick={() => removeAlert(alert.id)}
              className="ml-4 text-sm text-gray-200 hover:text-gray-400"
            >
              X
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
