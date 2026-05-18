import clsx from "clsx";
import React from "react";
import "./style2.css";

interface Iprops {
  label: string;
  className?: any;
  type?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  value: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
}

const FormCheck2 = ({
  label,
  className,
  type,
  disabled,
  id,
  name,
  checked,
  value,
  onChange,
}: Iprops) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event);
    }
  };

  const customCheckboxStyle = {
    backgroundColor: checked ? "white" : "white",
    borderColor: "#002d4f",
    color: "white",
  };

  return (
    <label
      htmlFor={`${id}`}
      className={clsx(
        className,
        "cursor-pointer font-normal md:text-base text-sm flex gap-2 items-start md:items-center "
      )}
    >
      <input
        checked={checked}
        value={value}
        type={type ? type : "checkbox"}
        className={clsx(
          type == "radio" && "form-radio-input",
          "form-check-input"
        )}
        name={name}
        id={`${id}`}
        disabled={disabled}
        onChange={handleChange}
        style={customCheckboxStyle}
      />
      {label}
    </label>
  );
};

export default FormCheck2;
