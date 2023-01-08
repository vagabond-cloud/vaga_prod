/* eslint-disable react/display-name */
import React, { forwardRef } from "react";

const Button = forwardRef(({ children, className, ...rest }, ref) => {

  return (
    <button
      className={`flex items-center justify-center h-12 px-5 py-2 space-x-3 rounded disabled:opacity-75 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;
