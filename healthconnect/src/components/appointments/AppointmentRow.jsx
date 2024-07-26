export default function AppointmentRow({ appointment, index, showUpcoming }) {
    return (
        <>
        <div key={index} className="row flex flex-col sm:flex-row sm:gap-9 items-center mt-4 px-4 sm:px-0">
        <div className="avatar w-16 sm:w-8">
          <img src={appointment.doctorAvatar} alt={appointment.doctorName} />
        </div>
        <div className="name w-full sm:w-1/6 text-[#273240]">{appointment.doctorName}</div>
        <div className="specialty w-full sm:w-1/6">{appointment.specialty}</div>
        <div className="date-time w-full sm:w-1/6 text-[#273240BB]">{appointment.date} - {appointment.time}</div>
        {showUpcoming && (
          <div className="flex gap-4 mt-2 sm:mt-0">
            <div className="join px-3 py-1 text-[#5A6ACF] border border-[#32D16D] transition-all cursor-pointer rounded-[5px] bg-[#DDE4F022] hover:bg-[#32D16DAA]">Join Call</div>
            <div className="cancel px-3 py-1 text-[#5A6ACF] border border-[#C42626] transition-all cursor-pointer rounded-[5px] bg-[#DDE4F022] hover:bg-red-200">Cancel Appointment</div>
          </div>
        )}
        {!showUpcoming && (
          <div className="flex gap-4 mt-2 sm:mt-0">
            <div className="report px-3 py-1 text-[#5A6ACF] border border-[#DDE4F0] transition-all cursor-pointer rounded-[5px] bg-[#DDE4F022] hover:bg-blue-100">View Report</div>
          </div>
        )}
      </div>
      <hr className="w-full mt-4" />
        </>
    )
}