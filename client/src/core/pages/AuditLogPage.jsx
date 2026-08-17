import { useEffect, useState } from "react";
import api from "../../api/axiosClient";

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get("/audit-logs").then((res) => setLogs(res.data.data));
  }, []);

  return (
    <div>
      <h2>Audit Log</h2>
      <table>
        <thead>
          <tr><th>When</th><th>User</th><th>Action</th><th>Entity</th></tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
              <td>{log.userName}</td>
              <td>{log.action}</td>
              <td>{log.entity}</td>
            </tr>
          ))}
          {logs.length === 0 && <tr><td colSpan={4}>No activity yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
