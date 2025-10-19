"use client";

import { useEffect } from "react";
import { Box } from "@mui/material";
import { AppConfig } from "@/configs/app.config";
import { Registry } from "@/context/AccessControlProvider/Registry";
import { useMainLayout } from "@/context/MainLayoutProvider";
import type { PageIDProps } from "./page-id-types";

const PageID = ({
  author,
  breadcrumbs,
  canonical,
  children,
  description,
  keywords,
  publisher,
  robots,
  title,
  path,
  permission,
}: PageIDProps) => {
  const { application } = AppConfig;

  const { setBreadcrumbs } = useMainLayout();

  useEffect(() => {
    console.log("bread => ", breadcrumbs);
    if (breadcrumbs) setBreadcrumbs(breadcrumbs);
  }, [breadcrumbs, setBreadcrumbs]);

  return (
    <Box>
      <title>{title ?? application.name}</title>
      <meta
        name="description"
        content={description ?? application.description}
      />
      <meta name="author" content={author ?? application.author} />
      <meta name="keywords" content={keywords ?? application.keywords} />
      <meta name="publisher" content={publisher ?? application.publisher} />
      <meta name="robots" content={robots ?? application.robots} />
      <link rel="canonical" href={canonical ?? application.canonical} />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      {path ? (
        <Registry
          path={path}
          permission={permission}
          onError={() => {
            console.error("Session Endded.");
          }}
        >
          <>{children}</>
        </Registry>
      ) : (
        <>{children}</>
      )}
    </Box>
  );
};

export default PageID;
