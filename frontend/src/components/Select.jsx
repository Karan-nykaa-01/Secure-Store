import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  required = false,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selectedOption = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={`w-full relative ${className}`} ref={ref}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-600 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={`relative w-full rounded-md border-2 bg-white px-3 py-2 text-left text-sm transition
          focus:outline-none focus:border-primary border-gray-300
          ${disabled ? "cursor-not-allowed bg-gray-100 opacity-70" : "hover:border-gray-400"}`}
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          className={`absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-transform
            ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && !disabled && (
        <ul className="absolute left-0 right-0 z-10 mt-1 max-h-56 overflow-auto rounded-md border-2 border-gray-300 bg-white py-1 text-sm shadow-lg">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`cursor-pointer px-3 py-2 transition
                ${
                  value === option.value
                    ? "bg-gray-50 text-primary"
                    : "hover:bg-gray-100"
                }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
