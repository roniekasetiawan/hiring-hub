import type { ReactNode } from "react";
import { AppBar, Box, Stack, Toolbar, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useMainLayout } from "@/context/MainLayoutProvider";
import HeaderProfile from "./Profile";
import ContainerBreadcrumbs from "../Container/Breadcrumbs";

const MainHeader = (): Readonly<ReactNode> => {
  const { breadcrumbs } = useMainLayout();

  const isLgUp = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    paddingRight: 8,
    paddingLeft: 8,
    background: "#fafafa",
    borderBottom: "1px solid #EAEAEA",
    borderRadius: 0,
    boxShadow: "unset",
  }));

  const ToolbarStyled = styled(Toolbar)(() => ({
    columnGap: 4,
    width: "100%",
    height: 76,
    color: "black",
  }));

  return (
    <AppBarStyled color="default">
      <ToolbarStyled sx={{ maxWidth: "1300px", margin: "0px auto" }}>
        {isLgUp && (
          <ContainerBreadcrumbs
            title={breadcrumbs?.title || ""}
            routes={breadcrumbs?.routes || []}
          />
        )}
        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center" columnGap={2}>
          <Box sx={{ height: 26, width: "1px", backgroundColor: "#8F8F8F" }} />
          <HeaderProfile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default MainHeader;
