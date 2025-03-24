import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Run only on the homepage
  useEffect(() => {
    if (location.pathname !== "/") return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  const handleUserIconClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    navigate(`/login`);
};

//   const scrollToCategory = () => {
//     const categorySection = document.getElementById("categories");
//     if (categorySection) {
//       categorySection.scrollIntoView({ behavior: "smooth" });
//     }
//   };

  return (
    // <header className="bg-white border-b fixed">
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        location.pathname === "/" && scrolled ? "shadow-md bg-gray-400" // On the homepage, apply this styles only when scrolled
        : location.pathname !== "/" ? "shadow-md bg-gray-400" : "" // On all other pages, apply this styles by default
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="https://res.cloudinary.com/dschfkj54/image/upload/v1742753030/485713948_632125426372122_1685471156183650104_n_idq8lr.png" 
                alt="Anna Logo" 
                className="h-10 w-auto"
              />
              {/* <div>Anna Shop</div> */}
            </Link>
          </div>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="#" className="text-gray-700 hover:text-green-600 font-medium">
              Trang chủ
            </Link>
            <div className="relative group">
              {/* <Link to="#" onClick={scrollToCategory} className="text-gray-700 hover:text-green-600 font-medium"> */}
              <Link to="" className="text-gray-700 hover:text-green-600 font-medium flex items-center">
                Danh mục
                {/* <span className="ml-1">▼</span> */}
              </Link>
              {/* Dropdown would go here */}
            </div>
            <Link to="#" className="text-gray-700 hover:text-green-600 font-medium">
              Blog
            </Link>
            <Link to="#" className="text-gray-700 hover:text-green-600 font-medium">
              Liên hệ
            </Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hover:cursor-pointer">
              <Search className="h-5 w-5 text-gray-700" />
            </Button>
            <Button
             variant="ghost"
             size="icon" 
             className="hover:cursor-pointer" 
             onClick={(e) => handleUserIconClick(e)
             }>
              <User className="h-5 w-5 text-gray-700"/>
            </Button>
            <Button variant="ghost" size="icon" className="hover:cursor-pointer">
              <ShoppingCart className="h-5 w-5 text-gray-700" />
            </Button>
            
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5 text-gray-700" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
