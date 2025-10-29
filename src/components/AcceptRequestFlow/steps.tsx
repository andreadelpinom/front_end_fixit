import React from "react";
import { TextInput } from "react-native";
import { StepProps, StepFormProps, Request } from "../../types";

const Steps: React.FC<StepProps<Request> & { refs: StepFormProps["refs"] }> = ({ data, refs }) => {
    return (
        <>
            <TextInput
                ref={refs.priceRef}
                value={data.costoEstimado?.toString() ?? ""}
            />
            <TextInput
                ref={refs.dateRef}
                value={data.fechaProgramada ?? ""}
            />
            <TextInput
                ref={refs.timeRef}
                value={data.duracionEstimadaMin?.toString() ?? ""}
            />
        </>
    );
};

export default Steps;
