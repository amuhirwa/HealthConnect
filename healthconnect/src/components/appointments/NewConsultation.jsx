import AvailableDoctors from "./AvailableDoctors";
import RandomMatch from "./RandomMatch";

export default function NewConsultation() {
    return (
        <div className="new-consultation p-4">
            <RandomMatch />
            <hr className="w-full mt-4" />
            <AvailableDoctors />
        </div>
    )
}