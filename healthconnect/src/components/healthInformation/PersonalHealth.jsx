import EditIcon from '@mui/icons-material/Edit';

export default function PersonalHealth() {
    return (
      <div className="mx-4 flex flex-col gap-6 w-[40%] max-w-lg bg-white p-6 pb-3 rounded-lg shadow-lg">
        <div className="per-info flex flex-col gap-4">
          <span className="text-xl font-semibold text-blue-600">Personal Info</span>
          <div className="info flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-700">Age:</span>
              <span className="text-gray-900 font-medium">22</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-700">Height:</span>
              <span className="text-gray-900 font-medium flex items-center gap-2"><span>180cm</span><EditIcon /></span>
              
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-700">Weight:</span>
              <span className="text-gray-900 font-medium flex items-center gap-2"><span>84kg</span><EditIcon /></span>
            </div>
          </div>
        </div>
  
        <div className="health-metrics flex flex-col gap-4">
          <span className="text-xl font-semibold text-blue-600">Health Metrics</span>
          <div className="info flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-700">Blood Glucose:</span>
              <span className="text-gray-900 font-medium">92mg/dL</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-700">Blood Pressure:</span>
              <span className="text-gray-900 font-medium">120/80</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-700">Past Diagnoses:</span>
              <button className="report px-3 py-1 text-blue-600 border border-blue-200 transition-all cursor-pointer rounded-md bg-blue-50 hover:bg-blue-100">View Details</button>
            </div>
            <div className="flex justify-between items-center border-b">
              <span className="text-gray-700">Known Allergies:</span>
              <button className="report px-3 py-1 text-blue-600 border border-blue-200 transition-all cursor-pointer rounded-md bg-blue-50 hover:bg-blue-100">View Details</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  