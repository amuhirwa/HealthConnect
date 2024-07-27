import SideBar from "../sharedComponents/SideBar"
import TopBar from "../sharedComponents/TopBar"

export default function PatientDash() {
    return (
        <div className="mx-3">
            <div className="top-half">
                One Chart
            </div>

            <div className="bottom-half">
                <div className="upcoming">
                    Upcoming
                </div>

                <div className="recent">
                    Recent
                </div>
            </div>
        </div>
    )
}