import { Inertia } from "@inertiajs/inertia";
import React, { useEffect, useState } from "react";
import { encodeQuery, resolveQueryParameter } from "../utils/helper";

interface IPaginate {
  next?: (next: number) => void;
  prev?: (prev: number) => void;
  total?: number;
}

const Pagination = (props: IPaginate) => {
  const params = resolveQueryParameter(location.search);
  const [nextNumber, setNextNumber] = useState(
    Number(params.get("page") ?? "0"),
  );
  const [prevNumber, setPrevNumber] = useState(
    Number(params.get("page") ?? "0"),
  );

  const [updatePrevNumber, setUpdatePrevNumber] = useState<boolean>();


  useEffect(() => {
    console.log(updatePrevNumber)
    if (props.prev != undefined) {
      props.prev(prevNumber);
    }
  }, [updatePrevNumber]);

  return (
    <nav
      className="flex items-center justify-between border-gray-200 bg-white mt-7"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to{" "}
          <span className="font-medium">10</span> of{" "}
          <span className="font-medium">20</span> results
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <button
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={() => {
            if (Number(params.get("page") ?? "0") == 0) {
              setPrevNumber(0);
            } else {
              setPrevNumber(nextNumber + 1);
            }

            setUpdatePrevNumber(!updatePrevNumber)
          }}
        >
          Previous
        </button>
        <button
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={() => {
            if (props.next != undefined) {
              const params = resolveQueryParameter(location.search);
              let next: number;
              next = Number(params.get("page") ?? "0") + 1;
              props.next(next);
            }
          }}
        >
          Next
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
