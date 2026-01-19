import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  TextField,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import FormDialog from "../../../Component/Admin/addmodal";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import AdminSearch from "../../../Component/Admin/adminsearch";
import DoctorSearch from "../../../Component/Doctor/doctorsearch";
import VendorSearch from "../../../Component/Vendor/vendorsearch";
import Cookies from "js-cookie";
import BaseUrl from "../../../Api/baseurl";
import Breadcrumbs from "@mui/material/Breadcrumbs";

const SlotSettings = () => {
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState("");
  const [isUpdateSlotsChecked, setIsUpdateSlotsChecked] = useState(false);
  const [isAutoGenerateChecked, setIsAutoGenerateChecked] = useState(false);
  const [endDate, setEndDate] = useState(null);
  const [slotsData, setSlotsData] = useState({});
  // const [open, setOpen] = useState(false);
  const [durations, setDurations] = useState({});
  // const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [isVendor, setIsVendor] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [data, setData] = useState({
    number_of_days: null,
    check_days: false,
    until_date: null,
    auto_generate: false,
  });
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [Doctorlist, setDoctorlist] = useState([]);
  const name = useRef();
  const username = Cookies.get("username");

  useEffect(() => {
    setIsVendor(Cookies.get("is_vendor") === "true");
    setIsSuperuser(Cookies.get("is_superuser") === "true");
    setIsStaff(Cookies.get("is_staff") === "true");
    getDoctorlist();

    // getCsrfToken();
  }, []);
  useEffect(() => {
    if (
      Doctorlist.length > 0 &&
      Doctorlist.some((doctor) => doctor.username === username)
    ) {
      name.current = username;
      getData(name.current);
      fetchData(name.current);

      setSelectedDoctor(name.current);
    }
  }, [Doctorlist, username]);

  const handledoctorchange = (e) => {
    const { value } = e.target;
    setSelectedDoctor(value);
    name.current = value;
    getData(name.current);
    fetchData(name.current);
  };

  const getDoctorlist = async () => {
    const token = Cookies.get("token");
    const apiUrl = `${BaseUrl}clinic/doctorlist/`;
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setDoctorlist(response.data);
    } catch (error) {
      console.error("Error fetching slot data:", error);
    }
  };

  const getData = async (username) => {
    
    const apiUrl = `${BaseUrl}clinic/defaultslots/`;
    const token = Cookies.get("token");
    try {
      const response = await axios.get(apiUrl, {
        params: {
          username:username
        },
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setSlotsData(response.data);
    } catch (error) {
      console.error("Error fetching slot data:", error);
      if (error.code === "ERR_BAD_REQUEST") {
        Swal.fire({
          icon: "warning",
          title: "Session expired. Please login again.",
        });
        Cookies.remove("token");
        Cookies.remove("username");
        Cookies.remove("is_superuser");
        Cookies.remove("is_staff");
        Cookies.remove("is_vendor");
        Cookies.remove("status");
        Cookies.remove("roles");
        Cookies.remove("subroles");
        if (isSuperuser) {
          navigate("/admin/login");
        } else if (isVendor) {
          navigate("/vendor/login");
        } else {
          navigate("/doctor/login");
        }
      }
    }
  };

  const fetchData = async (username) => {
    try {
      
      const apiUrl = `${BaseUrl}clinic/defaultsettings/`;
      const token = Cookies.get("token");
      const response = await axios.get(apiUrl, {
        params: {
          username:username
        },
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const result = response.data;
      if (Array.isArray(result) && result.length > 0) {
        const data = result[0];
        setData(data);
        if (data.until_date === null) {
          setEndDate(null);
        } else if (data.until_date !== null) {
          setEndDate(dayjs(data.until_date));
        }
        setSelectedDays(data.number_of_days);
        setIsAutoGenerateChecked(data.auto_generate);
        setIsUpdateSlotsChecked(data.check_days);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSlotsChange = (event) => {
    const checked = event.target.checked;

    if (selectedDays === "" || selectedDays === null) {
      Swal.fire("Error", "Please select Number Of Days first.", "question");
      return;
    }

    setIsUpdateSlotsChecked(checked);
  };

  const handleAutoGenerateChange = (event) => {
    setIsAutoGenerateChecked(event.target.checked);
  };

  const handleDateChange = (newValue) => {
    if (newValue && dayjs.isDayjs(newValue)) {
      setEndDate(newValue);
    } else {
      setEndDate(null);
    }
  };

  const handleSelectChange = (event) => {
    setSelectedDays(event.target.value);
    if (event.target.value === "" || event.target.value === null) {
      setIsUpdateSlotsChecked(false);
    }
  };

  const handleDurationChange = (day, index, event) => {
    setDurations((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [index]: event.target.value,
      },
    }));
  };

  const handleTimeChange = (day, index, type, newValue) => {
    if (newValue && dayjs.isDayjs(newValue)) {
      setSlotsData((prev) => {
        const newSlots = [...prev[day]];
        newSlots[index] = {
          ...newSlots[index],
          [type]: newValue.format("HH:mm:ss"),
        };
        return { ...prev, [day]: newSlots };
      });
    } else {
      setSlotsData((prev) => {
        const newSlots = [...prev[day]];
        newSlots[index] = {
          ...newSlots[index],
          [type]: null,
        };
        return { ...prev, [day]: newSlots };
      });
    }
  };

  const handleSubSlotDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0324fc",
      cancelButtonColor: "#fc0303",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        const payload ={
          username : name.current
        };
        await axios.delete(`${BaseUrl}clinic/defaultslots/${id}/`,payload);
        getData(name.current);
        Swal.fire("Deleted!", "Slot has been deleted.", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error!", "There was a problem deleting the slot.", "error");
      }
    }
  };
  const handleUpdate = async (day) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to update the slots!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0324fc",
      cancelButtonColor: "#fc0303",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      const updatedSlots = [];
      let validationError = false;

      slotsData[day].forEach((slot, index) => {
        const startTime = slot.start;
        const endTime = slot.end;

        if (startTime === endTime) {
          validationError = true;
          return Swal.fire(
            "Error",
            "Start time must not be equal to end time.",
            "warning"
          );
        }

        updatedSlots.push({
          id: slot.id,
          start_time: startTime,
          end_time: endTime,
          duration: durations[day]?.[index] || slot.duration,
          username:name.current
        });
      });
      if (validationError) {
        return;
      }

      try {
        
        await axios.put(
          `${BaseUrl}clinic/defaultslots/${
            day.charAt(0).toUpperCase() + day.slice(1)
          }/`,
          updatedSlots,

          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        getData(name.current);
        Swal.fire("Updated!", "Your slots have been updated.", "success");
      } catch (error) {
        console.error("Error updating slots:", error);
        Swal.fire("Error!", "There was a problem updating the slots.", "error");
      }
    }
  };

  const handleDayDelete = async (day) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete all slots for the selected day!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0324fc",
      cancelButtonColor: "#fc0303",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      const slotIdsToDelete = slotsData[day].map((slot) => slot.id);

      try {
        
        await axios.delete(
          `${BaseUrl}clinic/defaultslots/${
            day.charAt(0).toUpperCase() + day.slice(1)
          }/`,
          { 
            
            data: { ids: slotIdsToDelete,
              username : name.current
            },
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        getData(name.current);
        Swal.fire(
          "Deleted!",
          "The selected slots have been deleted.",
          "success"
        );
      } catch (error) {
        console.error("Error deleting slots:", error);
        Swal.fire("Error!", "There was a problem deleting the slots.", "error");
      }
    }
  };

  const handleReset = () => {
    setSelectedDays(null);
    setIsUpdateSlotsChecked(false);
    setIsAutoGenerateChecked(false);
    setEndDate(null);
    setDurations({});
    setData({
      number_of_days: null,
      check_days: false,
      until_date: null,
      auto_generate: false,
    });
  };

  const handleSettingSave = async () => {
    const token = Cookies.get("token");

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to Save the settings!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0324fc",
      cancelButtonColor: "#fc0303",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      const updatedSettings = {
        number_of_days: selectedDays,
        check_days: isUpdateSlotsChecked,
        until_date: endDate !== null ? endDate.format("YYYY-MM-DD") : null,
        auto_generate: isAutoGenerateChecked,
        username : name.current
      };

      try {
        await axios.put(`${BaseUrl}clinic/defaultsettings/`, updatedSettings, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        await axios.post(`${BaseUrl}clinic/generateslots/`);
        fetchData(name.current);
        Swal.fire("Saved!", "Your settings have been Saved.", "success");
      } catch (error) {
        console.error("Error saving settings:", error);
        Swal.fire(
          "Error!",
          "There was a problem saving the settings.",
          "error"
        );
      }
    }
  };
  function handleBreadClick(event) {
    event.preventDefault();
  }
  return (
    <div className="py-8 px-8 w-full md:w-[80%] xl:w-full">
      {isSuperuser ? (
        <AdminSearch />
      ) : isVendor && !isStaff ? (
        <VendorSearch />
      ) : isVendor && isStaff ? (
        <DoctorSearch />
      ) : isStaff && !isVendor ? (
        <DoctorSearch />
      ) : null}
      <div role="presentation" onClick={handleBreadClick} className="ml-1">
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                className="hover:underline"
                color="inherit"
                to={isSuperuser ? "/admin/" : isVendor ? "/vendor" : "/doctor"}
              >
                Dashboard
              </Link>
              <Link
                className="hover:underline text-inherit"
                color="inherit"
                to={
                  isSuperuser
                    ? "/admin/manageslots"
                    : isVendor
                    ? "/vendor/manageslots"
                    : "/doctor/manageslots"
                }
              >
                Manage Slots
              </Link>
              <Link className="hover:underline text-inherit" color="inherit">
                Slot-Settings
              </Link>
            </Breadcrumbs>
          </div>

      <div className="w-full min-h-screen bg-[#F2F2F2]  py-4 mt-3  ">
        <div className="flex items-center justify-between pb-4 px-2 sm:!px-4">
          <text className="font-nunito-sans text-[22px] sm:text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Slot-Settings
          </text>
        </div>

        <main className="flex flex-col p-4 sm:p-6 md:p-8 lg:p-12 space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
          <div className="mb-4">
            <label
              htmlFor="doctor"
              className="block text-md font-medium leading-6 text-gray-900"
            >
              Doctor
              <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <select
                id="doctor"
                name="doctor"
                value={selectedDoctor}
                onChange={handledoctorchange}
                disabled={
                  Doctorlist.length > 0 &&
                  Doctorlist.some((doctor) => doctor.username === username)
                    ? true
                    : false
                }
                autoComplete="doctor"
                className={`block w-full md:w-1/2 lg:w-1/3 h-9 bg-white rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600  sm:text-sm sm:leading-6 ${
                  Doctorlist.length > 0 &&
                  Doctorlist.some((doctor) => doctor.username === username)
                    ? "cursor-not-allowed"
                    : ""
                }`}
              >
                {" "}
                <option value="">Select a doctor</option>
                {Doctorlist.length > 0 &&
                  Doctorlist.map((doctor) => (
                    <>
                      <option value={doctor.username}>
                        {doctor.fname} {doctor.lname}
                      </option>
                    </>
                  ))}
              </select>
            </div>
            <span className="text-red-500 mt-2 text-sm">
              {/* {formErrors.doctor} */}
            </span>
          </div>
          {selectedDoctor ? (
            Object.entries(slotsData).map(([day, slots]) => (
              <div
                key={day}
                className="flex flex-col border border-2 border-gray-400 p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </h2>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4 sm:mt-6 lg:mt-8">
                  {slots.length > 0 ? (
                    slots.map((slot, index) => (
                      <div
                        key={index}
                        className="border border-gray-500 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-lg sm:text-xl lg:text-2xl font-medium">
                            Slot-{slot.slot_number}:
                          </span>
                          <button
                            onClick={() => handleSubSlotDelete(slot.id)}
                            className="flex items-center justify-center rounded-full text-white text-sm font-bold"
                          >
                            <MdDelete className="text-black text-[25px] text-[#D30E0E]" />
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 py-4">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className="w-full">
                              <TimePicker
                                label="Start Time"
                                value={
                                  slot.start
                                    ? dayjs(slot.start, "HH:mm:ss")
                                    : null
                                }
                                ampm={false}
                                onChange={(newValue) => {
                                  if (newValue) {
                                    handleTimeChange(
                                      day,
                                      index,
                                      "start",
                                      newValue
                                    );
                                  } else {
                                    handleTimeChange(day, index, "start", null);
                                  }
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                                sx={{ width: "100%" }}
                              />
                            </div>

                            <div className="w-full">
                              <TimePicker
                                label="End Time"
                                value={
                                  slot.end ? dayjs(slot.end, "HH:mm:ss") : null
                                }
                                ampm={false}
                                onChange={(newValue) => {
                                  if (newValue) {
                                    handleTimeChange(
                                      day,
                                      index,
                                      "end",
                                      newValue
                                    );
                                  } else {
                                    handleTimeChange(day, index, "end", null);
                                  }
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                                sx={{ width: "100%" }}
                              />
                            </div>
                          </LocalizationProvider>

                          <div className="w-full">
                            <FormControl fullWidth>
                              <InputLabel>Duration</InputLabel>
                              <Select
                                value={
                                  durations[day]?.[index] || slot.duration || ""
                                }
                                label="Duration"
                                onChange={(event) =>
                                  handleDurationChange(day, index, event)
                                }
                              >
                                <MenuItem value={10}>10 mins</MenuItem>
                                <MenuItem value={15}>15 mins</MenuItem>
                                <MenuItem value={20}>20 mins</MenuItem>
                                <MenuItem value={30}>30 mins</MenuItem>
                              </Select>
                            </FormControl>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 font-bold text-xl">
                      No slots available
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-end gap-6 sm:gap-8 mt-6">
                  <div className="flex items-center gap-4 p-2">
                    <FormDialog
                      dayName={day.charAt(0).toUpperCase() + day.slice(1)}
                      username={name.current}
                    />
                    <button
                      onClick={() => handleUpdate(day)}
                      className="px-1 py-2 bg-[#6F3AC7] w-[80px] sm:w-[90px] text-white text-base sm:text-sm font-bold rounded-lg"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDayDelete(day)}
                      className="px-1 py-2 bg-[#D30E0E] w-[80px] sm:w-[90px] text-white text-base sm:text-sm font-bold rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-3xl text-gray-400 text-center font-semibold">
              Please Select a Doctor to Update Settings
            </p>
          )}
        </main>
        {selectedDoctor && (
          <section className="ml-4 sm:ml-6 md:ml-8 lg:ml-10 mt-6 sm:mt-8 md:mt-10 px-2 sm:px-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl underline font-medium">
              Other Settings:
            </h2>
            <div className="flex flex-col xl:flex-row items-start justify-center mt-6 sm:mt-8 gap-6 sm:gap-8">
              {!endDate && (
                <div className="flex flex-col items-start gap-2">
                  <div className="flex flex-wrap items-center gap-1">
                    <Checkbox
                      checked={isUpdateSlotsChecked}
                      onChange={handleUpdateSlotsChange}
                    />
                    <span className="text-[12px] sm:text-[14px]">
                      Please check to update slots for upcoming
                    </span>
                    <FormControl>
                      <InputLabel id="date-select-label">
                        Select Days
                      </InputLabel>
                      <Select
                        labelId="date-select-label"
                        label="Select Days"
                        value={selectedDays}
                        onChange={handleSelectChange}
                        sx={{
                          height: "50px",
                          width: "100px",
                          textAlign: "center",
                          "& .MuiSelect-select": {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          },
                        }}
                      >
                        <MenuItem value={null}>0</MenuItem>
                        {Array.from({ length: 31 }, (_, index) => (
                          <MenuItem key={index + 1} value={index + 1}>
                            {index + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <span className="text-[12px] sm:text-[14px]">days</span>
                  </div>
                  {isUpdateSlotsChecked && (
                    <div className="flex items-center gap-1">
                      <Checkbox
                        checked={isAutoGenerateChecked}
                        onChange={handleAutoGenerateChange}
                      />
                      <span className="text-[12px] sm:text-[14px]">
                        Auto-Generate
                      </span>
                    </div>
                  )}
                </div>
              )}
              {!isUpdateSlotsChecked && (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Continue Slots Until"
                    value={endDate}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        className="w-full sm:w-auto"
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            </div>
          </section>
        )}
        {selectedDoctor && (
          <footer className="flex flex-row items-center justify-center mt-10 gap-2 sm:!gap-4">
            <button
              onClick={() => handleSettingSave()}
              className="px-4 py-2 bg-[#6F3AC7] text-xs sm:text-base text-white font-bold rounded-lg text-center"
            >
              Save
            </button>

            <button
              onClick={() => handleReset()}
              className="px-4 py-2 bg-[#D30E0E] text-xs sm:text-base text-white font-bold rounded-lg text-center"
            >
              Reset
            </button>

            <Link
              to={isVendor ? "/vendor/manageslots" : "/doctor/manageslots"}
              className="font-bold px-4 py-2 text-xs sm:text-base text-gray-700 hover:text-gray-900 text-center rounded-lg"
            >
              Cancel
            </Link>
          </footer>
        )}
      </div>
    </div>
  );
};

export default SlotSettings;
