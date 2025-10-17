import type { ThemeOptions } from '@mui/material/styles';

export const typography: ThemeOptions['typography'] = {
    fontFamily: [
        'Inter', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif',
    ].join(','),
    body2: { fontSize: 12, lineHeight: '20px' },
    body1: { fontSize: 14, lineHeight: '24px' },
    subtitle2: { fontSize: 16, lineHeight: '28px', fontWeight: 500 },
    subtitle1: { fontSize: 16, lineHeight: '28px', fontWeight: 700 },
    h6: { fontSize: 20, lineHeight: '32px', fontWeight: 400 },
    h5: { fontSize: 20, lineHeight: '32px', fontWeight: 700 },
    h4: { fontSize: 24, lineHeight: '36px', fontWeight: 500 },
    h3: { fontSize: 24, lineHeight: '36px', fontWeight: 700 },
    h2: { fontSize: 32, lineHeight: '44px', fontWeight: 400 },
    h1: { fontSize: 32, lineHeight: '44px', fontWeight: 700 },
    overline: { fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase' },
    button: { fontWeight: 700 },
};
