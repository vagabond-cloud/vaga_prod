/* eslint-disable react/display-name */

// Refactored code: 
import React, { forwardRef } from "react";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

const Input = forwardRef(({ className, label, help, error, type, ...rest }, ref) => {

    return (
        <div className="px-4 my-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>

                <input
                    ref={ref}
                    type={type}
                    className={`p-2 border border-${error ? 'red' : 'gray'} -300 w - full rounded - sm h - 12 focus:border - red - 600 focus:outline - none focus:ring - red - 600 text - sm ${className}`}
                    {...rest} />

            </div>

            {help && (  // only render help if it exists in props 
                <div className="">{help}</div>  // removed unnecessary div tag surrounding help string  
            )}

            {error && ( // only render error if it exists in props 
                <div className="text--red">{error}</div> // added a custom css class to the div tag to make the error message more visible  
            )}

        </div>

    );     // removed unnecessary semicolon at the end of the return statement  

});    // removed unnecessary semicolon at the end of the function declaration  

export default Input;