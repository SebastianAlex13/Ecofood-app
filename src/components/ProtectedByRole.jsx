export default function ProtectedByRole({ allowed, children }) {
  const { userData, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;

  if (!userData || !allowed.includes(userData.tipo)) {
    return <Navigate to="/login" />;
  }

  return children;
}
