/* eslint-disable react/display-name */
import React, { forwardRef } from "react";

const Input = forwardRef(({ className, type, ...rest }, ref) => {

    if (type === "checkbox") {
        return (
            <input
                type="checkbox"
                className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-6 h-6 text-xl  border-gray-300 rounded-md text-red-500"
                {...rest}
            />
        )
    } else if (type === "textarea") {
        return (
            <input
                className="p-2 border-gray-300  border w-full rounded-sm h-12 focus:border-red-600 focus:outline-none focus:ring-red-600 text-sm"
                {...rest}
            />
        )
    } else if (type === "date") {
        return (
            <input
                type="date"
                className="p-2 border-gray-300  border w-full rounded-sm h-12 focus:border-red-600 focus:outline-none focus:ring-red-600 text-sm"
                {...rest}
            />
        )
    }
    else {
        return (
            <input
                className="p-2 border-gray-300  border w-full rounded-sm h-12 focus:border-red-600 focus:outline-none focus:ring-red-600 text-sm"
                {...rest}
            />

        );
    }
});

export default Input;
