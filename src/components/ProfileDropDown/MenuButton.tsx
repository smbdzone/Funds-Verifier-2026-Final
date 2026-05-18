import React from "react";
type Props = {
  open?: boolean;
  setOpen?: any;
};
const MenuButton = (props: Props) => {
  const toggleOpen = () => {
    props.setOpen(!props.open);
  };
  return (
    <div
      onClick={() => toggleOpen()}
      className="w-8 h-8 relative focus:outline-none inline-flex items-center justify-center  cursor-pointer rounded-lg"
    >
      <div className="block w-5 absolute left-3.5 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <span
          className={`${
            props.open ? "rotate-45" : "-translate-y-1.5"
          } block absolute h-0.5 w-6 text-theme bg-current transform transition duration-500 ease-in-out`}
        ></span>
        <span
          className={`${
            props.open ? "opacity-0" : ""
          } block absolute left-2 h-0.5 w-4 text-theme bg-current transform transition duration-500 ease-in-out`}
        ></span>
        <span
          className={`${
            props.open ? "-rotate-45" : "translate-y-1.5"
          } block absolute h-0.5 w-6 text-theme bg-current transform transition duration-500 ease-in-out`}
        ></span>
      </div>
    </div>
  );
};
export default MenuButton;
