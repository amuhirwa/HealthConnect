import { format } from "date-fns";
import createAxiosInstance from "../../features/axios";

export default function AppointmentRow({
  appointment,
  index,
  showUpcoming,
  highlight,
  onCancel,
}) {
  const instance = createAxiosInstance();

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return format(date, "MMM dd, yyyy h:mm a");
  };

  const handleCancel = async () => {
    try {
      await instance.patch(`/appointments/${appointment.id}/cancel`);
      onCancel(appointment.id);
    } catch (error) {
      console.error("Failed to cancel the appointment:", error);
    }
  };

  return (
    <>
      <div
        key={index}
        className={`row flex flex-col sm:flex-row sm:gap-9 items-center mt-4 px-4 ${
          highlight
            ? "bg-[#fffae6] border border-[#ffecb3] rounded px-4 py-2"
            : "bg-white sm:px-0"
        }`}
      >
        <div className="avatar w-16 sm:w-8">
          <img
            src={
              appointment.doctorAvatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt={appointment.doctor.user.name}
          />
        </div>
        <div className="name w-full sm:w-1/6 text-[#273240]">
          {appointment.doctor.user.name}
        </div>
        <div className="specialty w-full sm:w-1/6">
          {appointment.doctor.specialization}
        </div>
        <div className="date-time w-full sm:w-1/6 text-[#273240BB]">
          {formatDate(appointment.start)}
        </div>
        {showUpcoming && (
          <div className="flex gap-4 mt-2 sm:mt-0">
            <div
              onClick={() => {
                createCall("");
                dispatch(changepage("call"));
              }}
              className="join px-3 py-1 text-[#5A6ACF] border border-[#32D16D] transition-all cursor-pointer rounded-[5px] bg-[#DDE4F044] hover:bg-[#32D16DAA]"
            >
              Join Call
            </div>
            <div
              onClick={handleCancel}
              className="cancel px-3 py-1 text-[#5A6ACF] border border-[#C42626] transition-all cursor-pointer rounded-[5px] bg-[#DDE4F044] hover:bg-red-200"
            >
              Cancel Appointment
            </div>
          </div>
        )}
        {!showUpcoming && (
          <div className="flex gap-4 mt-2 sm:mt-0">
            <div className="report px-3 py-1 text-[#5A6ACF] border border-[#DDE4F0] transition-all cursor-pointer rounded-[5px] bg-[#DDE4F044] hover:bg-blue-200">
              View Report
            </div>
          </div>
        )}
      </div>
      <hr className="w-full mt-4" />
    </>
  );
}
