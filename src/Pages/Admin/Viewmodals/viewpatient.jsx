import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import { FaReply } from "react-icons/fa";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  maxHeight: "90vh",
  bgcolor: "background.paper",
  borderRadius: 2,
  // border: "3px solid #113C54",
  boxShadow: 24,
  p: 3,
  overflowY: "auto",
};

const PatientModal = ({ open, onClose, service }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStyle}>
        {/* Header with Title and Close Button */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography
            id="modal-title"
            variant="h5"
            fontWeight={600}
            color="#113C54"
          >
            Patient Details
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
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
              >
                ID:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{service.id}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Name */}
            <Grid item xs={4}>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
              >
                Name:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{service.name}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* UserName */}
            <Grid item xs={4}>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
              >
                Userame:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{service.username}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Date of Birth */}
            <Grid item xs={4}>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
              >
                Date of Birth:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{service.date_of_birth}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Age */}
            <Grid item xs={4}>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
              >
                Age:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{service.age}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Gender */}
            <Grid item xs={4}>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
              >
                Gender:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{service.gender}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Email */}
            <Grid item xs={4}>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
              >
                Email:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{service.email}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Contact */}
            <Grid item xs={4}>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
              >
                Contact No.:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{service.contact}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Blood Group */}
            <Grid item xs={4}>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
              >
                Blood Group:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{service.blood_group}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Address */}
            <Grid item xs={4}>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
              >
                Address:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{service.address}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* City */}
            <Grid item xs={4}>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
              >
                City:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{service.city}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* State */}
            <Grid item xs={4}>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
              >
                State:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{service.state}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Zip Code */}
            <Grid item xs={4}>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
              >
                Zipcode:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{service.zipcode}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Image */}
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                Image:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Box component="img"
                   src={service.image}
                   alt={`${service.name}`}
                   sx={{ width: 100, height: 80, borderRadius: 1, objectFit: "cover" }}
              />
            </Grid>
          </Grid>
        )}
      </Box>
    </Modal>
  );
};

export default PatientModal;
