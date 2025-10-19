'use client';

import { Box, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { SxProps } from '@mui/system';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

const SimpleBarStyle = styled(SimpleBar)(() => ({
  maxHeight: '100%'
}));

interface MainScrollbarProps {
  children: React.ReactElement | React.ReactNode;
  sx: SxProps;
}

const MainScrollbar = ({ children, sx, ...other }: MainScrollbarProps) => {
  const lgDown = useMediaQuery((theme: any) => theme.breakpoints.down('lg'));

  if (lgDown) {
    return <Box sx={{ overflowX: 'auto' }}>{children}</Box>;
  }

  return (
    <SimpleBarStyle sx={sx} {...other}>
      {children}
    </SimpleBarStyle>
  );
};

export default MainScrollbar;
