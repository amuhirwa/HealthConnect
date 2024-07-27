import { useState, useEffect } from "react";
import PersonalHealth from "./PersonalHealth";
import createAxiosInstance from "../../features/axios";

export default function HealthInformation() {
    const instance = createAxiosInstance();
    const [healthMetrics, setHealthMetrics] = useState([]);

    useEffect(() => {
        const fetchHealthMetrics = async () => {
            try {
                const res = await instance.get('/get_health_metrics');
                setHealthMetrics(res.data.metrics);
            } catch (error) {
                console.error("Failed to fetch health metrics:", error);
            }
        };

        fetchHealthMetrics();
    }, []);

    return (
        <div>
            <PersonalHealth metrics={healthMetrics} />
        </div>
    );
}
