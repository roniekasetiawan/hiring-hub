'use client';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { components } from './components';
import { lightTokens, gradients } from './tokens/palettes/partials/common/light';
import { typography } from './typography';

export const createAppTheme = () =>
    responsiveFontSizes(
        createTheme({
            ...lightTokens,
            typography,
            components,
        })
    );

export const themeHelpers = { gradients };
