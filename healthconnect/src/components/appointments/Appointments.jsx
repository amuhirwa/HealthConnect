import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import AppointmentRow from './AppointmentRow';
import { useSelector, useDispatch } from 'react-redux';
import { changepage } from '../../features/SharedData';

export default function Appointments() {
  const [showUpcoming, setShowUpcoming] = useState(true);
  const page = useSelector((state) => state.sharedData.page);

  const upcomingAppointments = [
    {
      doctorAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      doctorName: "Dr. John Doe",
      specialty: "Cardiology",
      date: "2024-07-24",
      time: "12:00",
    },
    {
      doctorAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      doctorName: "Dr. Jane Smith",
      specialty: "Dermatology",
      date: "2024-07-25",
      time: "10:00",
    },
    {
      doctorAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      doctorName: "Dr. John Doe",
      specialty: "Cardiology",
      date: "2024-07-24",
      time: "12:00",
    },
    {
      doctorAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      doctorName: "Dr. Jane Smith",
      specialty: "Dermatology",
      date: "2024-07-25",
      time: "10:00",
    },
    {
      doctorAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      doctorName: "Dr. John Doe",
      specialty: "Cardiology",
      date: "2024-07-24",
      time: "12:00",
    },
    {
      doctorAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      doctorName: "Dr. Jane Smith",
      specialty: "Dermatology",
      date: "2024-07-25",
      time: "10:00",
    },
    {
      doctorAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      doctorName: "Dr. John Doe",
      specialty: "Cardiology",
      date: "2024-07-24",
      time: "12:00",
    },
    {
      doctorAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      doctorName: "Dr. Jane Smith",
      specialty: "Dermatology",
      date: "2024-07-25",
      time: "10:00",
    },
    {
      doctorAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      doctorName: "Dr. John Doe",
      specialty: "Cardiology",
      date: "2024-07-24",
      time: "12:00",
    },
    {
      doctorAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      doctorName: "Dr. Jane Smith",
      specialty: "Dermatology",
      date: "2024-07-25",
      time: "10:00",
    },
    {
      doctorAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      doctorName: "Dr. John Doe",
      specialty: "Cardiology",
      date: "2024-07-24",
      time: "12:00",
    },
    {
      doctorAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      doctorName: "Dr. Jane Smith",
      specialty: "Dermatology",
      date: "2024-07-25",
      time: "10:00",
    },
    {
      doctorAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      doctorName: "Dr. John Doe",
      specialty: "Cardiology",
      date: "2024-07-24",
      time: "12:00",
    },
    {
      doctorAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      doctorName: "Dr. Jane Smith",
      specialty: "Dermatology",
      date: "2024-07-25",
      time: "10:00",
    },
    {
      doctorAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      doctorName: "Dr. John Doe",
      specialty: "Cardiology",
      date: "2024-07-24",
      time: "12:00",
    },
    {
      doctorAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      doctorName: "Dr. Jane Smith",
      specialty: "Dermatology",
      date: "2024-07-25",
      time: "10:00",
    },
  ];
  
  const pastAppointments = [
    {
      doctorAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      doctorName: "Dr. Emily Johnson",
      specialty: "Neurology",
      date: "2024-06-20",
      time: "14:00",
    },
    {
      doctorAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      doctorName: "Dr. Michael Brown",
      specialty: "Pediatrics",
      date: "2024-05-18",
      time: "09:00",
    },
  ];

  const dispatch = useDispatch();

  const toggleAppointments = () => {
    setShowUpcoming(!showUpcoming);
  };

  const appointments = showUpcoming ? upcomingAppointments : pastAppointments;

  return (
    <div className="mt-2 mx-4 flex flex-col">
      <div className="new-consultation mr-4 mb-1 ml-auto flex items-center text-[#2F4AD6] font-medium px-4 py-2 bg-[#149D5266] rounded-lg cursor-pointer" onClick={() => dispatch(changepage("new consultation"))}>
        <AddIcon sx={{ fontSize: 28 }} />
        <span className="text-md">New Consultation</span>
      </div>
      <div className="appointments-toggle mb-2 flex justify-center">
        <button
          className={`px-4 w-1/2 sm:w-1/4 py-2 rounded-l-lg ${showUpcoming ? 'bg-[#2F4AD6] text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => setShowUpcoming(true)}
        >
          Upcoming
        </button>
        <button
          className={`px-4 w-1/2 sm:w-1/4 py-2 rounded-r-lg ${!showUpcoming ? 'bg-[#2F4AD6] text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => setShowUpcoming(false)}
        >
          Past
        </button>
      </div>
      <div className="appointments-list w-full text-center sm:text-left">
        <span className="text-lg font-medium ml-4 sm:ml-14">{showUpcoming ? 'Upcoming Appointments' : 'Past Appointments'}</span>
        <div className="text-lg sm:text-sm">
          {appointments.length === 0 ? (
            <div className="mt-4 text-center text-gray-500">
              No {showUpcoming ? 'upcoming' : 'past'} appointments.
            </div>
          ) : (
            appointments.map((appointment, index) => (
              <AppointmentRow appointment={appointment} index={index} showUpcoming={showUpcoming} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
