import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
      });
      
      const { login } = useAuthStore();
    
      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password);
            navigate("/admin");
        } catch (error) {
            console.error(error);
        }
      };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="bg-white rounded-xl shadow-md flex w-full max-w-5xl overflow-hidden">
            {/* Left: Login form */}
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <h2 className="text-2xl font-bold mb-6 md:mb-10">Đăng nhập 
                <span className="text-gray-500">(Dành cho Admin)</span>
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1">Nhập email</label>
                  <input
                    type="text"
                    placeholder="Nhập email của bạn tại đây..."
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nhập mật khẩu</label>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu..."
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div className="text-right">
                  <a href="#" className="text-sm text-green-500 hover:underline">Quên mật khẩu?</a>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-400 text-white font-semibold py-2 rounded-lg hover:bg-green-500 transition"
                >
                  Đăng nhập
                </button>
              </form>
            </div>
    
            {/* Right: Illustration */}
            <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-100">
              <img
                src="https://res.cloudinary.com/dschfkj54/image/upload/v1742818693/login-admin_sljbvi.jpg"
                alt="Login Illustration"
                className="w-fit h-fit"
              />
            </div>
          </div>
        </div>
      );
    };

export default LoginPage