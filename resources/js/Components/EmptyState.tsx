import React from "react";

interface IEmptyState {
  title: string;
  description?: string;
  button?: JSX.Element;
}

const EmptyState = (props: IEmptyState) => {
  return (
    <div className="mt-40">
      <div className="text-center grid grid-cols-1">
        <div>
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {props.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{props.description}</p>
          <div className="mt-6">{props.button}</div>
        </div>
      </div>
    </div>
  );
};

export { EmptyState };
