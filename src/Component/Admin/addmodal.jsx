import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import format from "date-fns/format";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import BaseUrl from "../../Api/baseurl";

export default function FormDialog({ dayName,username }) {

  const [open, setOpen] = React.useState(false);
 
  
  const [formData, setFormData] = React.useState({
    startTime: null,
    endTime: null,
    duration: "",
  });
  const [formError, setFormError] = React.useState({
    startTime: "",
    endTime: "",
    duration: "",
  });

  const [existingSlots, setExistingSlots] = React.useState([]);
  
  const handleClickOpen = async () => {
    
    await getData(dayName,username);
    setOpen(true);
  };

  const getData = async (day,username) => {
    try {
      const apiUrl = `${BaseUrl}clinic/defaultslots/${day}/`;
      const token = Cookies.get("token");
      const response = await axios.get(
        apiUrl,{
          params:{
            username:username
          },
          headers: {
            Authorization: `Token ${token}`,
          },  
        }
      );
      setExistingSlots(response.data);
    } catch (error) {
      console.error("Error fetching slot data:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormError({ startTime: "", endTime: "", duration: "" });
    setFormData({ startTime: null, endTime: null, duration: "" });
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { ...formError };
  
    if (!formData.startTime) {
      errors.startTime = "Please select a Start Time";
      isValid = false;
    }
    if (!formData.endTime) {
      errors.endTime = "Please select an End Time";
      isValid = false;
    }
    if (!formData.duration) {
      errors.duration = "Please select a Duration";
      isValid = false;
    }
  
    const start = formData.startTime ? format(formData.startTime, "HH:mm:ss") : null;
    const end = formData.endTime ? format(formData.endTime, "HH:mm:ss") : null;
  
    if (start && end && start >= end) {
      errors.endTime = "End time must be after start time.";
      isValid = false;
    }
  
    if (existingSlots.length > 0) {
      for (const slot of existingSlots) {
        const existingStart = format(new Date(`1970-01-01T${slot.start_time}`), "HH:mm:ss");
        const existingEnd = format(new Date(`1970-01-01T${slot.end_time}`), "HH:mm:ss");
        if (
          (start >= existingStart && start < existingEnd) || 
          (end > existingStart && end <= existingEnd) || 
          (start <= existingStart && end >= existingEnd) 
        ) {
          errors.startTime = "Time overlaps with existing slots.";
          errors.endTime = "Time overlaps with existing slots.";
          isValid = false;
          break;
        }
      }
    }
  
    setFormError(errors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (validateForm()) {
      const slotDetails = {
        start_time: formData.startTime ? format(formData.startTime, "HH:mm:ss") : null,
        end_time: formData.endTime ? format(formData.endTime, "HH:mm:ss") : null,
        duration: formData.duration,
        day_of_week: dayName,
        username:username
      };
      try {
        const apiUrl=`${BaseUrl}clinic/defaultslots/`;
        const token = Cookies.get("token");
        
       
  
        await axios.post(apiUrl, slotDetails,{
       
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        Swal.fire("Added!", "Your slot has been added.", "success");
        handleClose();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.error("Error posting slot details:", error);
        Swal.fire("Error!", "Failed to add slot.", "error");
      }
    }
  };

  return (
    <React.Fragment>
      <button
        className="px-1 py-2 bg-green-500 w-[80px] sm:w-[90px] text-white text-base sm:text-sm font-bold rounded-lg"
        onClick={handleClickOpen}
      >
        Add Slot
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>New Slot</DialogTitle>
        <DialogContent>
          <DialogContentText>Please Enter the Slot Details</DialogContentText>
          <div className="flex flex-col py-4">
            <div className="flex items-center w-full">
              <TextField
                label="Day"
                value={dayName}
                disabled
                placeholder="Enter Day (e.g., Monday)"
              />
            </div>
            <div className="flex gap-6 py-4">
              <div className="flex flex-col w-full py-2">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label="Start Time"
                    value={formData.startTime}
                    ampm={false}
                    onChange={(newValue) => handleChange("startTime", newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                {formError.startTime && <span className="text-red-500 mt-2 text-sm">{formError.startTime}</span>}
              </div>

              <div className="flex flex-col w-full py-2">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label="End Time"
                    value={formData.endTime}
                    ampm={false}
                    onChange={(newValue) => handleChange("endTime", newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                {formError.endTime && <span className="text-red-500 mt-2 text-sm">{formError.endTime}</span>}
              </div>

              <div className="flex w-full">
                <FormControl sx={{ m: 1, minWidth: 130 }} size="medium">
                  <InputLabel id="duration-label">Duration</InputLabel>
                  <Select
                    labelId="duration-label"
                    value={formData.duration}
                    label="Duration"
                    onChange={(event) => handleChange("duration", event.target.value)}
                  >
                    <MenuItem value="">
                      <em>Select duration</em>
                    </MenuItem>
                    <MenuItem value={10}>10 minutes</MenuItem>
                    <MenuItem value={15}>15 minutes</MenuItem>
                    <MenuItem value={20}>20 minutes</MenuItem>
                    <MenuItem value={30}>30 minutes</MenuItem>
                  </Select>
                  {formError.duration && <span className="text-red-500 mt-2 text-sm">{formError.duration}</span>}
                </FormControl>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
