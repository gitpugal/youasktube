import React from "react";

type CreditsBadgeProps = {
  credits: number;
};

export default function CreditsBadge({ credits }: CreditsBadgeProps) {
  return (
    <div
      className={`inline-flex w-fit md:w-full text-center justify-center hover:rotate-x-360 cursor-pointer duration-700 transition-all ease-in-out items-center px-3 py-1 rounded-full text-sm  border z-50${
        credits > 0
          ? " bg-green-200 text-green-800"
          : " bg-red-100 text-red-800"
      }`}
      title={credits > 0 ? "Credits left" : "No credits left"}
    >
      {credits > 0 ? (
        <>
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c-1.104 0-2 .896-2 2v4c0 1.104.896 2 2 2s2-.896 2-2v-4c0-1.104-.896-2-2-2z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12" />
          </svg>
          {credits} Credits
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          No Credits
        </>
      )}
    </div>
  );
}
