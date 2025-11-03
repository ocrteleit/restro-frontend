// Forbidden page for non-admins or unauthorized access

export default function ForbiddenPage() {
  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h1>403 — Forbidden</h1>
      <p>You do not have permission to view this page.</p>
      <a href="/">Go Home</a>
    </div>
  );
}
