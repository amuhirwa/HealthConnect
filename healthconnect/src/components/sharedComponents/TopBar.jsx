import { useState, useEffect, useRef } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";

export default function TopBar({ isOpen, toggleSidebar }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="topBar flex items-center w-full justify-between shadow-md bg-white sticky top-0 sm:px-4">
      <div className="flex items-center gap-2">
        {!isOpen && (
          <MenuIcon
            sx={{ fontSize: 30, cursor: "pointer" }}
            onClick={toggleSidebar}
            className={`${isOpen ? "hidden" : "block"}`}
          />
        )}
        {!isOpen && (
          <span className="hidden sm:block sm:text-xl text-[#12B536] sm:ml-1">
            <span className="text-[#2F4AD6]">Health</span>Connect
          </span>
        )}
      </div>
      <div
        className="relative hover:bg-gray-200 p-3 rounded-md"
        ref={dropdownRef}
      >
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="Avatar"
            className="w-10 rounded-full"
          />
          <span className="ml-2 hidden sm:block">John Doe</span>
          <ArrowDropDownIcon />
        </div>
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
            <div className="px-4 py-2 cursor-pointer hover:bg-gray-100">
              Profile
            </div>
            <div className="px-4 py-2 cursor-pointer hover:bg-gray-100">
              Settings
            </div>
            <div className="px-4 py-2 cursor-pointer hover:bg-gray-100">
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
