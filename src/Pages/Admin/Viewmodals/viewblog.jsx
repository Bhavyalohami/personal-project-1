import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import parse from "html-react-parser";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  maxHeight: "90vh",
  bgcolor: "background.paper",
  borderRadius: 2,
  // border: '3px solid #113C54',
  boxShadow: 24,
  p: 3,
  overflowY: "auto",
};

const BlogModal = ({ open, onClose, service }) => {
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
            Blog Details
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

            {/* Description */}
            <Grid item xs={4}>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
              >
                Description:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{parse(service.text)}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Author */}
            <Grid item xs={4}>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
              >
                Author:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{service.author}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {/*Category*/}
            <Grid item xs={4}>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
              >
                Category:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{service.category}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Created At */}
            <Grid item xs={4}>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
              >
                Created At:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">{service.date}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Image */}
            <Grid item xs={4}>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
              >
                Image:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Box
                component="img"
                src={service.image}
                alt={service.name}
                sx={{ width: "120px", height: "80px", borderRadius: "4px" }}
              />
            </Grid>
          </Grid>
        )}
      </Box>
    </Modal>
  );
};

export default BlogModal;
