import { useAuth } from "../auth/AuthContext.jsx";

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="card" style={{ maxWidth: 400 }}>
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
}
