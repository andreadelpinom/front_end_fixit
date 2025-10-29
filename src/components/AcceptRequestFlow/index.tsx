import React, { useRef } from "react";
import { TextInput } from "react-native";
import { AcceptRequestFlowProps } from "../../types";
import Steps from "./steps";

const AcceptRequestFlow: React.FC<AcceptRequestFlowProps> = ({ request }) => {
    const priceRef = useRef<TextInput>(null);
    const dateRef = useRef<TextInput>(null);
    const timeRef = useRef<TextInput>(null);
    const codeRef = useRef<TextInput>(null);

    return (
        <>
            {request && (
                <Steps
                    data={request}
                    refs={{ priceRef, dateRef, timeRef, codeRef }}
                />
            )}
        </>
    );
};

export default AcceptRequestFlow;
