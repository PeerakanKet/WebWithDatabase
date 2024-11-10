// rafce
// rfce
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom"; // เพิ่ม useNavigate
import useEcomStore from "../store/ecom-store";
import { ChevronDown } from "lucide-react";

function MainNav() {
  const carts = useEcomStore((s) => s.carts);
  const user = useEcomStore((s) => s.user);
  const logout = useEcomStore((s) => s.logout);

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // เพิ่ม useNavigate

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // สร้างฟังก์ชัน handleLogout เพื่อ logout และนำทางไปหน้า Login
  const handleLogout = () => {
    logout();
    navigate("/login"); // ไปที่หน้า Login หลังจาก logout
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to={"/"}>
              <img
                src="/images/logo.jpg" // ใส่ URL ของรูปภาพที่คุณต้องการใช้แทน LOGO
                alt="Logo"
                className="h-10" // ปรับขนาดของรูปภาพให้พอดีกับ Navbar
              />
            </Link>

            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  : "hover:bg-slate-200 px-3 py-2 rounded-md text-sm font-medium "
              }
              to={"/"}
            >
              หน้าแรก
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  : "hover:bg-slate-200 px-3 py-2 rounded-md text-sm font-medium "
              }
              to={"/shop"}
            >
              ร้านค้า
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  : "hover:bg-slate-200 px-3 py-2 rounded-md text-sm font-medium "
              }
              to={"/cart"}
            >
              รถเข็น
              {carts.length > 0 && (
                <span className="absolute top-0 bg-red-500 rounded-full px-2">
                  {carts.length}
                </span>
              )}
            </NavLink>
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 hover:bg-gray-200 px-2 py-3 rounded-md"
              >
                <img
                  className="w-8 h-8"
                  src="https://cdn.iconscout.com/icon/free/png-512/free-avatar-icon-download-in-svg-png-gif-file-formats--user-professor-avatars-flat-icons-pack-people-456317.png?f=webp&w=256"
                  alt="User Avatar"
                />
                <ChevronDown />
              </button>

              {isOpen && (
                <div
                  className="absolute top-16 bg-white shadow-md rounded z-50" // Added z-50
                >
                  <Link
                    to={"/user/history"}
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    ประวัติการสั่งซื้อ
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    ล็อกเอาท์
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                    : "hover:bg-slate-200 px-3 py-2 rounded-md text-sm font-medium "
                }
                to={"/register"}
              >
                Register
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                    : "hover:bg-slate-200 px-3 py-2 rounded-md text-sm font-medium "
                }
                to={"/login"}
              >
                Login
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default MainNav;
