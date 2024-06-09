/* eslint-disable @typescript-eslint/ban-types */
import { useEffect, useRef } from "react";

const useInterval = (callback: Function, interval: number | null) => {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        if (interval === null) return;
        const timer = setInterval(() => savedCallback.current(), interval);
        return () => clearInterval(timer);
    }, [interval]);
}

export default useInterval;