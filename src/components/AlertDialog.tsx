'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onClose,
  title = 'Notification !',
  message,
}) => {
  return (
    <Dialog
      disableScrollLock={true}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '400px',
          maxWidth: '90%',
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          p: 2,
          backgroundColor: '#fefefe',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: 'Kanit',
          fontSize: '22px',
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center',
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent>
        <Typography
          sx={{
            fontFamily: 'Outfit',
            fontSize: '16px',
            color: '#555',
            textAlign: 'center',
          }}
        >
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: '#000',
            color: '#fff',
            borderRadius: '8px',
            textTransform: 'none',
            paddingX: 4,
            fontFamily: 'Outfit',
            fontWeight: '600',
            '&:hover': {
              backgroundColor: '#222',
            },
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
