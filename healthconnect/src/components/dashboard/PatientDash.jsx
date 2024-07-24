import SideBar from "../sharedComponents/SideBar"
import TopBar from "../sharedComponents/TopBar"

export default function PatientDash() {
    return (
        <div className="dashboard flex justify-between">
            <SideBar />
            <TopBar />
        </div>
    )
}