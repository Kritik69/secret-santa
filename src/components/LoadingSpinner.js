'use client';
import { CircularProgress, Box } from '@mui/material';

export default function LoadingSpinner({ size = 40 }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 4,
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
} 