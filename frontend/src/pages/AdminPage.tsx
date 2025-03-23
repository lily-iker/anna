import { useAuthStore } from "@/stores/useAuthStore";
import UnauthorizedPage from "./UnauthorizedPage";

const AdminPage = () => {
    const { authUser, isLoading } = useAuthStore();

    if (authUser?.role != "ADMIN" && !isLoading) return (<UnauthorizedPage />);

  return (
    <div className=''>Admin Dashboard</div>
  )
}

export default AdminPage