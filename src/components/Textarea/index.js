/* eslint-disable react/display-name */
import React, { forwardRef } from "react";

const Textarea = forwardRef(({ className, type, rows, placeholder, label, ...rest }, ref) => {
    console.log(rows)
    return (
        <>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="mt-1">
                <textarea
                    type={type}
                    rows={rows.toString()}
                    cols="50"
                    placeholder={placeholder}
                    defaultValue={rest.defaultValue}
                    className={`p-2 border-gray-300  border w-full rounded-sm h-12 focus:border-red-600 focus:outline-none focus:ring-red-600 text-sm`}
                    {...rest}
                />
            </div>
        </>
    );
});

export default Textarea;