import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  overflowY: 'auto',
};
const AppointmentModal = ({ open, onClose, service }) => {
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
              Appointment Details
            </Typography>
            <IconButton onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
          
          {/* Divider */}
          <Divider variant="middle" sx={{ mb: 2 }} />
  
          {/* Appointment Details */}
          {service && (
            <Grid container spacing={0.8}>
              {[
                { label: "ID", value: service.id },
                { label: "Name", value: service.name },
                { label: "Email", value: service.email },
                { label: "Age", value: service.age },
                { label: "Gender", value: service.gender },
                { label: "Contact", value: service.contact },
                { label: "City", value: service.city },
                { label: "Date", value: service.date },
                { label: "Time", value: service.time },
                { label: "Location", value: service.location },
                { label: "Department", value: service.department },
                { label: "Doctor", value: service.doctor },
                { label: "Problem", value: service.problem },
              ].map((item, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                      {item.label}:
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2" color="text.primary">
                      {item.value}
                    </Typography>
                  </Grid>
                  {index < 12 && <Grid item xs={12}><Divider /></Grid>}
                </React.Fragment>
              ))}
            </Grid>
          )}
        </Box>
      </Modal>
    );
};

export default AppointmentModal;
