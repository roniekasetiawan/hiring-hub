import { Components, Theme } from '@mui/material/styles';
import { brand, elevations, neutral } from './tokens/palettes/partials/common/light';

export const components: Components<Theme> = {
    MuiPaper: {
        styleOverrides: { root: { borderRadius: 18, border: `1px solid ${neutral[30]}` } },
    },
    MuiOutlinedInput: {
        styleOverrides: {
            root: ({ theme }) => ({
                minWidth: '125px',
                height: '40px',
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.background.default}`,
                borderRadius: '10px',
                '&.--pagination': { minWidth: '0' },
                '&:hover': { borderColor: '#6F88C6' },
                '&:focus': { borderColor: '#6F88C6' },
                '&.--no-border': { border: 'none' },
                '&.--no-border .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '&.Mui-disabled .MuiOutlinedInput-notchedOutline': { border: 'none' }
            }),
            multiline: {
                height: 'auto'
            }
        }
    },
    MuiTextField: {
        defaultProps: { fullWidth: true },
    },
    MuiButton: {
        styleOverrides: {
            root: {
                minWidth: '176px',
                borderRadius: 5,
                textTransform: 'capitalize',
                '&:disabled': {
                    backgroundColor: '#DEDEDE',
                    color: '#767474'
                }
            }
        },
        variants: [
            {
                props: { variant: 'contained', color: 'primary' },
                style: {
                    backgroundColor: '#681399',
                    color: '#ffffff',
                    '&:hover': { backgroundColor: '#0e245c' }
                }
            },
            {
                props: { variant: 'outlined', color: 'primary' },
                style: {
                    backgroundColor: '#ffffff',
                    borderColor: '#681399',
                    color: '#681399',
                    '&:hover': {
                        backgroundColor: '#681399',
                        color: 'white'
                    }
                }
            },
            {
                props: { variant: 'contained', color: 'secondary' },
                style: {
                    backgroundColor: '#EA3C30',
                    color: '#ffffff'
                }
            },
            {
                props: { variant: 'outlined', color: 'secondary' },
                style: {
                    backgroundColor: '#ffffff',
                    borderColor: '#EA3C30',
                    color: '#EA3C30',
                    '&:hover': {
                        backgroundColor: '#EA3C30',
                        color: 'white'
                    }
                }
            },
            {
                props: { variant: 'contained', color: 'success' },
                style: {
                    background: '#E3FFE2',
                    border: '1px solid #4CC34A',
                    color: '#515151',
                    '.MuiSvgIcon-root': {
                        color: '#4CC34A'
                    },
                    '&:hover': {
                        backgroundColor: '#4CC34A',
                        color: 'white'
                    }
                }
            }
        ]
    },
    MuiCheckbox: {
        styleOverrides: {
            root: { '&.Mui-checked': { color: brand.primary.main } },
        },
    },
    MuiRadio: {
        styleOverrides: {
            root: { '&.Mui-checked': { color: brand.primary.main } },
        },
    },
    MuiChip: {
        styleOverrides: {
            root: { borderRadius: 999, fontWeight: 600 },
            outlined: { borderColor: neutral[40] },
            colorPrimary: { backgroundColor: brand.primary.surface, color: brand.primary.main },
            colorSuccess: { backgroundColor: brand.success.surface, color: brand.success.main },
            colorError: { backgroundColor: brand.danger.surface, color: brand.danger.main },
            colorWarning: { backgroundColor: brand.warning.surface, color: brand.warning.main },
        },
    },
    MuiMenu: { styleOverrides: { paper: { borderRadius: 12, boxShadow: '0 12px 24px rgba(2,6,23,.12)' } } },
    MuiPopover: { styleOverrides: { paper: { borderRadius: 12 } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 16, boxShadow: elevations.modal } } },
    MuiDivider: { styleOverrides: { root: { borderColor: neutral[40] } } },
};
