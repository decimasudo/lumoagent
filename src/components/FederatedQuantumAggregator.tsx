import { useState } from "react";
import { div } from "three/tsl";

interface ModelMEtrics {
    loss: number;
    accuracy: number;
    activeNodes: number;
    latencyMs: number;
}

export default function FederatedQuantumAggregator() {
    const [isTraining, setIsTraining] = useState(false);
    const [epoch, setEpoch] = useState(0);
    const [metrics, setMetrics] = useState<ModelMEtrics>({
        loss: 0,
        accuracy: 0,
        activeNodes: 0,
        latencyMs: 0
    })
    
    return (
        <div>

        </div>
    )
}