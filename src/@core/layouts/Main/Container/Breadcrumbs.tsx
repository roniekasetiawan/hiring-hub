import type { BreadcrumbsInterface } from "@/@core/components/PageID/page-id-types";
import { FC } from "react";

const ChevronSeparator: FC = () => (
  <svg
    className="h-5 w-5 text-black"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 4.5l7.5 7.5-7.5 7.5"
    />
  </svg>
);

const ContainerBreadcrumbs = ({ routes }: BreadcrumbsInterface) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        {routes
          ? routes.map((route, index) => {
              const isLast = index === routes.length - 1;

              return (
                <li
                  key={`${index + route.label}`}
                  className="flex items-center"
                >
                  <a
                    href={route.href}
                    className={`flex items-center rounded-lg px-5 py-2 text-sm font-semibold transition-colors
                  ${
                    isLast
                      ? "bg-gray-100 text-gray-700"
                      : "bg-white text-gray-800 shadow-sm border border-gray-200 hover:bg-gray-50"
                  }`}
                  >
                    {route.label}
                  </a>

                  {!isLast && (
                    <div className="ml-4">
                      <ChevronSeparator />
                    </div>
                  )}
                </li>
              );
            })
          : undefined}
      </ol>
    </nav>
  );
};

export default ContainerBreadcrumbs;
