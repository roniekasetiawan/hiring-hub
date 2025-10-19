"use client";

import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import MainContainer from "./Container";
import MainHeader from "./Header";

const LayoutMain = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Box
        display="flex"
        flexGrow={1}
        flexDirection="column"
        zIndex={1}
        width="100%"
      >
        <MainHeader />
        <MainContainer>{children}</MainContainer>
        <Box component="footer" py={1} px={6}>
          <Typography component="small" color={"primary"}>
            &copy; Roni Eka S
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default LayoutMain;
