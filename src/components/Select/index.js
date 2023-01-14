import React, { forwardRef } from "react";

const Select = forwardRef(({ className, type, children, ...rest }, ref) => {
    return (
        <select
            className="block w-full rounded-sm border-gray-300 py-2 pl-3 pr-10 h-12 text-base focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
            {...rest}
        >
            {children}
        </select>
    )
})
Select.displayName = "Select"
export default Select;
