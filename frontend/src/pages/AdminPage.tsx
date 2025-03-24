import { useAuthStore } from "@/stores/useAuthStore";
import UnauthorizedPage from "./UnauthorizedPage";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminPage = () => {
  const { authUser, isLoading } = useAuthStore();
  const navigate = useNavigate();

  if (authUser?.role !== "ADMIN" && !isLoading) return <UnauthorizedPage />;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>
      <Button onClick={() => navigate("/")}>Go to Home</Button>
    </div>
  );
};

export default AdminPage;
