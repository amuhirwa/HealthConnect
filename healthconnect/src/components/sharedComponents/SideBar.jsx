import AssessmentIcon from "@mui/icons-material/Assessment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import MedicationIcon from "@mui/icons-material/Medication";
import PersonIcon from "@mui/icons-material/Person";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useState } from "react";

export default function SideBar() {
    const [open, setOpen] = useState(true);
  return (
    <div className={`SideBar flex flex-col h-[100vh] w-full sm:w-fit ${!open ? "bg-white transition-all" : "bg-[#1681af5c] transition-all"} gap-[4vh] p-4 text-2xl sm:text-base`}>
      <div className="logo flex items-center gap-4 w-full mt-2">
        <span className="text-2xl sm:text-xl text-[#12B536] sm:ml-1">
          <span className="text-[#2F4AD6]">Health</span>Connect
        </span>{" "}
        <MenuOpenIcon sx={{ fontSize: 30, cursor: "pointer" }} onClick={() => setOpen(!open)} />
      </div>
      <hr />
      <div className={`main flex flex-col gap-[4vh] ${open ? "transition-all" : "w-0 p-0 overflow-hidden transition-all duration-500"}`}>
        <div className="menu ml-5 flex flex-col gap-4 sm:gap-3">
          <span className="text-xl sm:text-lg">Menu</span>
          <div className="text-[#5A6ACF] flex gap-2 items-center bg-[#707FDD66] px-6 py-2 -ml-[1.5rem] rounded rounded-md cursor-pointer">
            <AssessmentIcon /> Dashboard
          </div>
          <div className="text-[#273240BB] flex gap-2 hover:bg-[#5A6ACF22] transition-all items-center px-6 py-2 -ml-[1.5rem] rounded rounded-md cursor-pointer">
            <CalendarMonthIcon />
            Appointments
          </div>
          <div className="text-[#273240BB] flex gap-2 hover:bg-[#5A6ACF22] transition-all items-center px-6 py-2 -ml-[1.5rem] rounded rounded-md cursor-pointer">
            <TextSnippetIcon />
            Health Information
          </div>
          <div className="text-[#273240BB] flex gap-2 hover:bg-[#5A6ACF22] transition-all items-center px-6 py-2 -ml-[1.5rem] rounded rounded-md cursor-pointer">
            <MedicationIcon />
            Prescriptions
          </div>
        </div>
        <div className="others ml-5 flex flex-col gap-4 sm:gap-3">
          <span className="text-xl sm:text-lg">Others</span>
          <div className="text-[#273240BB] flex gap-2 hover:bg-[#5A6ACF22] transition-all items-center px-6 py-2 -ml-[1.5rem] rounded rounded-md cursor-pointer">
            <PersonIcon />
            Account
          </div>
          <div className="text-[#273240BB] flex gap-2 hover:bg-[#5A6ACF22] transition-all items-center px-6 py-2 -ml-[1.5rem] rounded rounded-md cursor-pointer">
            <HelpCenterIcon />
            Help
          </div>
        </div>
      </div>
    </div>
  );
}
