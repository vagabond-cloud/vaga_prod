/* eslint-disable react/display-name */
import React, { forwardRef } from "react";

const Input = forwardRef(({ className, type, blur, label, ...rest }, ref) => {

    return (
        <>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="mt-1">
                <input
                    type={type}
                    defaultValue={rest.defaultValue}
                    className={`p-2 border-gray-300  border w-full rounded-sm h-12 focus:border-red-600 focus:outline-none focus:ring-red-600 text-sm ${className}`}
                    {...rest}
                />
            </div>
        </>
    );
});

export default Input;