import React from "react";

const Coords = (props) => {
  return (
    <>
      <a href="#" class="block w-40 h-40 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 ">
        <h5 class="mb-2 text-xl font-bold text-wrap text-gray-900">{props.label}</h5>
        <p class="font-normal text-gray-700">{props.value}</p>
      </a>

    </>


  );
};

export default Coords;
