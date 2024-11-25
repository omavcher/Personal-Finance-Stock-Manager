import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';

const AlertComponent = ({ severity, message, onClose }) => {
  const [open, setOpen] = useState(true);

  // Automatically close alert after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
      if (onClose) onClose(); // Call the passed `onClose` function (optional)
    }, 4000);
    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [onClose]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose(); // Trigger the onClose prop function if available
  };

  return (
    open && (
      <Stack
        sx={{
          position: 'absolute',
          top: 100, // Adjust this value to control how far from the top of the page it appears
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999, // High z-index to make sure it stays on top of other content
          width: '90%', // Set the width to 90% for mobile screens
          maxWidth: '400px', // Set a max-width for the alert
          '@media (max-width:600px)': {
            width: '90%', // On smaller screens, width will be 90% of the screen
            top: 80, // Reduce top margin for small screens
          },
        }}
        spacing={2}
      >
        <Alert
          variant="filled"
          severity={severity}
          action={
            <Button color="inherit" size="small" onClick={handleClose}>
              <CancelIcon />
            </Button>
          }
        >
          {message}
        </Alert>
      </Stack>
    )
  );
};

export default AlertComponent;
