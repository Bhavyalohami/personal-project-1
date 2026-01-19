import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  borderRadius: 2,
  // border: '3px solid #113C54',
  boxShadow: 24,
  p: 3,
  overflowY: 'auto',
};

const ServiceModal = ({ open, onClose, service }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStyle}>
        {/* Header with Title and Close Button */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography id="modal-title" variant="h5" fontWeight={600} color="#113C54">
            Enquiry Details
          </Typography>
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Divider */}
        <Divider variant="middle" sx={{ mb: 2 }} />

        {/* Content */}
        {service && (
          <Grid container spacing={1}>
            {/* ID */}
            <Grid item xs={4}>
              <Typography variant="body2" fontWeight="bold" color="text.secondary">
                ID:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{service.id}</Typography>
            </Grid>
            <Grid item xs={12}><Divider /></Grid>

            {/* Name */}
            <Grid item xs={4}>
              <Typography variant="body2" fontWeight="bold" color="text.secondary">
                Name:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{service.name}</Typography>
            </Grid>
            <Grid item xs={12}><Divider /></Grid>

            {/* Email */}
            <Grid item xs={4}>
              <Typography variant="body2" fontWeight="bold" color="text.secondary">
                Email:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{service.email}</Typography>
            </Grid>
            <Grid item xs={12}><Divider /></Grid>

            {/* Contact */}
            <Grid item xs={4}>
              <Typography variant="body2" fontWeight="bold" color="text.secondary">
                Contact No.:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{service.phone}</Typography>
            </Grid>
            <Grid item xs={12}><Divider /></Grid>

            {/* Subject */}
            <Grid item xs={4}>
              <Typography variant="body2" fontWeight="bold" color="text.secondary">
                Subject:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{service.subject}</Typography>
            </Grid>
            <Grid item xs={12}><Divider /></Grid>

            {/* Message */}
            <Grid item xs={4}>
              <Typography variant="body2" fontWeight="bold" color="text.secondary">
                Message:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{service.message}</Typography>
            </Grid>
          </Grid>
        )}
      </Box>
    </Modal>
  );
};

export default ServiceModal;
