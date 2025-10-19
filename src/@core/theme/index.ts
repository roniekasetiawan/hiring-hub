"use client";

import { createTheme } from "@mui/material/styles";
import { components } from "./components";
import {
  lightTokens,
  gradients,
} from "./tokens/palettes/partials/common/light";
import { typography } from "./typography";

export const createAppTheme = () =>
  createTheme({
    ...lightTokens,
    typography,
    components,
  });

export const themeHelpers = { gradients };
