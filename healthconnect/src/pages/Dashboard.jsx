import { useState, useEffect } from "react";
import PatientDash from "../components/dashboard/PatientDash";
import SideBar from "../components/sharedComponents/SideBar";
import TopBar from "../components/sharedComponents/TopBar";
import { useSelector } from "react-redux";
import Appointments from "../components/appointments/Appointments";
import NewConsultation from "../components/appointments/NewConsultation";
import HealthInformation from "../components/healthInformation/HealthInformation";
import createAxiosInstance from "../features/axios";
import VideoCall from "../components/appointments/VideoCall";

export default function Dashboard() {
  const page = useSelector((state) => state.sharedData.page);
  const [isOpen, setIsOpen] = useState(true);
  const instance = createAxiosInstance();
  const isScreenWidth767 = () => {
    return window.innerWidth;
  };

  useEffect(() => {
    if (isScreenWidth767() >= 867) {
      setIsOpen(true); // Open sidebar if screen width is greater than or equal to 767 pixels
    } else {
      setIsOpen(false); // Close sidebar if screen width is less than 767 pixels
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="flex">
      <SideBar isOpen={isOpen} toggleSidebar={toggleSidebar}/>
      <div className="flex flex-col w-full">
        <TopBar isOpen={isOpen} toggleSidebar={toggleSidebar}/>
        {page === "dashboard" && <PatientDash />}
        {page === "appointments" && <Appointments />}
        {page === "new consultation" && <NewConsultation />}
        {page === "health information" && <HealthInformation />}
        {page === "call" && <VideoCall />}
      </div>
    </div>
  );
}
