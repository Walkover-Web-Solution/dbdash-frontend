
import { useEffect, useRef } from "react";
export function traceParentPropsUpdate(props, currentComponent = "========RERENDER HUA HEEEE========") {
    const prevProp = useRef(props);
    useEffect(() => {
        const updatedProps = Object.entries(props).reduce((previousStateKaSingleObject, [key, value]) => {
            if (prevProp.current[key] !== value) {
                previousStateKaSingleObject[key] = [prevProp.current[key], value];
            }
            return previousStateKaSingleObject;
        }, {});
        if (Object.keys(updatedProps).length) {
            console.log(currentComponent,' ke Prop me change he:', updatedProps);
        }
        console.log("RERENDER",currentComponent);
        prevProp.current = props;
    });
}