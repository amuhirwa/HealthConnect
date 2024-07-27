import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import toast from "react-hot-toast";
import createAxiosInstance from "../../features/axios";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../features/SharedData";

export default function PersonalHealth({ metrics }) {
  const [editableMetric, setEditableMetric] = useState({});
  const [editedValues, setEditedValues] = useState({});
  const instance = createAxiosInstance();
  const dispatch = useDispatch();

  const handleEditClick = (key) => {
    setEditableMetric((prev) => ({ ...prev, [key]: true }));
    setEditedValues((prev) => ({ ...prev, [key]: metrics[key] || "" }));
  };

  const handleInputChange = (key, value) => {
    setEditedValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveClick = (key) => {
    if (key === "blood_pressure") {
      const pressure_pattern = /^\d{1,3}\/\d{1,3}$/;
      if (!pressure_pattern.test(editedValues[key])) {
        console.log(
          "Invalid blood pressure format. Please enter a value in the format of systolic/diastolic."
        );
        toast.error(
          "Invalid blood pressure format. Please enter a value in the format of systolic/diastolic."
        );
        return;
      }
    }
    metrics[key] = editedValues[key];
    instance.post("/update_health_metrics", { [key]: editedValues[key] })
    .then((response) => {
      dispatch(updateProfile({ [key]: editedValues[key] }));
    })
    setEditableMetric((prev) => ({ ...prev, [key]: false }));
  };

  const renderInfo = (label, key, unit, isEditable = false) => (
    <div className="flex justify-between items-center border-b pb-2" key={key}>
      <span className="text-gray-700">{label}:</span>
      <span className="text-gray-900 font-medium flex items-center gap-2">
        {editableMetric[key] ? (
          <input
            type="number"
            value={editedValues[key]}
            onChange={(e) => handleInputChange(key, e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSaveClick(key)}
            className="border rounded px-2 py-1"
          />
        ) : (
          <span>
            {metrics[key] || (
              <AddIcon
                onClick={() => handleEditClick(key)}
                className="cursor-pointer text-blue-600"
              />
            )}
            {metrics[key] && ` ${unit || ""}`}
          </span>
        )}
        {editableMetric[key] && (
          <SaveIcon
            onClick={() => handleSaveClick(key)}
            className="cursor-pointer text-blue-600"
          />
        )}
        {metrics[key] && isEditable && !editableMetric[key] && (
          <EditIcon
            onClick={() => handleEditClick(key)}
            className="cursor-pointer text-blue-600"
          />
        )}
      </span>
    </div>
  );

  const personalInfo = [
    { label: "Age", key: "age" },
    { label: "Height", key: "height", unit: "cm", editable: true },
    { label: "Weight", key: "weight", unit: "kg", editable: true },
  ];

  const healthMetrics = [
    {
      label: "Blood Glucose",
      key: "blood_glucose",
      unit: "mg/dL",
      editable: true,
    },
    {
      label: "Blood Pressure",
      key: "blood_pressure",
      unit: "mmHg",
      editable: true,
    },
    { label: "Past Diagnoses", key: "past_diagnoses", isButton: true },
    { label: "Known Allergies", key: "known_allergies", isButton: true },
  ];

  return (
    <div className="mx-4 flex flex-col gap-6 w-[40%] max-w-lg bg-white p-6 pb-3 rounded-lg shadow-lg">
      <div className="per-info flex flex-col gap-4">
        <span className="text-xl font-semibold text-blue-600">
          Personal Info
        </span>
        <div className="info flex flex-col gap-3 text-sm">
          {personalInfo.map((info) =>
            renderInfo(info.label, info.key, info.unit, info.editable)
          )}
        </div>
      </div>

      <div className="health-metrics flex flex-col gap-4">
        <span className="text-xl font-semibold text-blue-600">
          Health Metrics
        </span>
        <div className="info flex flex-col gap-3 text-sm">
          {healthMetrics.map((info) => (
            <div
              className="flex justify-between items-center border-b pb-2"
              key={info.key}
            >
              <span className="text-gray-700">{info.label}:</span>
              {info.isButton ? (
                <button className="report px-3 py-1 text-blue-600 border border-blue-200 transition-all cursor-pointer rounded-md bg-blue-50 hover:bg-blue-100">
                  View Details
                </button>
              ) : (
                <span className="text-gray-900 font-medium flex items-center gap-2">
                  {editableMetric[info.key] ? (
                    <input
                      type="text"
                      value={editedValues[info.key]}
                      onChange={(e) =>
                        handleInputChange(info.key, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSaveClick(info.key)
                      }
                    />
                  ) : (
                    <span>
                      {metrics[info.key] || (
                        <AddIcon
                          onClick={() => handleEditClick(info.key)}
                          className="cursor-pointer text-blue-600"
                        />
                      )}
                      {metrics[info.key] && ` ${info.unit}`}
                    </span>
                  )}
                  {editableMetric[info.key] && (
                    <SaveIcon
                      onClick={() => handleSaveClick(info.key)}
                      className="cursor-pointer text-blue-600"
                    />
                  )}
                  {metrics[info.key] && info.editable && !editableMetric[info.key] && (
                    <EditIcon
                      onClick={() => handleEditClick(info.key)}
                      className="cursor-pointer text-blue-600"
                    />
                  )}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
