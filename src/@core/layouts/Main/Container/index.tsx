"use client";

import type { ReactNode } from "react";
import { Box, useMediaQuery, type Theme } from "@mui/material";

const MainContainer = ({ children }: { children: ReactNode }) => {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("xl"));

  return (
    <Box minHeight="calc(100vh - 170px)" px={lgUp ? 3 : 1}>
      <div>{children}</div>
    </Box>
  );
};

export default MainContainer;
