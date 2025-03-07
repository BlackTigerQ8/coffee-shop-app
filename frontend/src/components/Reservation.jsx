import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  TextField,
  InputAdornment,
  Button,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Schedule as ClockIcon,
  Group as GroupIcon,
} from "@mui/icons-material";

// Add this custom input component
const CustomInput = React.forwardRef(({ value, onClick, ...props }, ref) => (
  <input
    {...props}
    value={value}
    onClick={onClick}
    ref={ref}
    className="w-full bg-transparent text-white outline-none"
  />
));

const Reservation = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      date: null,
      time: null,
      persons: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      color: "white",
      "& fieldset": {
        borderColor: "#DA9F5B",
      },
      "&:hover fieldset": {
        borderColor: "#c48f51",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#DA9F5B",
      },
      "& input::placeholder": {
        color: "rgba(255, 255, 255, 0.5)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255, 255, 255, 0.7)",
      "&.Mui-focused": {
        color: "#DA9F5B",
      },
    },
    "& .MuiInputAdornment-root": {
      color: "#DA9F5B",
    },
    "& .MuiFormHelperText-root": {
      color: "#f44336",
      marginLeft: 0,
    },
  };

  const datePickerWrapperStyles = {
    "& .react-datepicker": {
      backgroundColor: "#33211D",
      border: "1px solid #DA9F5B",
    },
    "& .react-datepicker__header": {
      backgroundColor: "#DA9F5B",
      borderBottom: "none",
    },
    "& .react-datepicker__time-container": {
      borderLeft: "1px solid #DA9F5B",
    },
    "& .react-datepicker__time": {
      backgroundColor: "#33211D",
    },
    "& .react-datepicker__time-box": {
      borderRadius: "0",
    },
  };

  return (
    <div className="container mx-auto my-20" ref={ref}>
      <motion.div
        className="relative bg-secondary text-white p-8 lg:p-0 overlay-top overlay-bottom reservation rounded-lg"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side */}
          <motion.div className="my-5 lg:my-0" variants={itemVariants}>
            <div className="p-5 lg:p-20">
              <motion.div className="mb-8" variants={itemVariants}>
                <motion.h1
                  className="text-primary text-6xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  30% OFF
                </motion.h1>
                <h1 className="text-3xl text-white">For Online Reservation</h1>
              </motion.div>
              <motion.p className="mb-4" variants={itemVariants}>
                Lorem justo clita erat lorem labore ea, justo dolor lorem ipsum
                ut sed eos, ipsum et dolor kasd sit ea justo.
              </motion.p>
              <motion.ul className="space-y-2" variants={itemVariants}>
                {[1, 2, 3].map((_, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center"
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <i className="fas fa-check text-primary mr-3"></i>
                    Lorem ipsum dolor sit amet
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>

          {/* Right Side - Updated Form */}
          <motion.div
            className="bg-[rgba(51,33,29,0.8)] p-8 pt-0 lg:p-20 rounded-lg"
            variants={itemVariants}
          >
            <motion.h1
              className="text-3xl text-center mb-12"
              variants={itemVariants}
            >
              Book Your Table
            </motion.h1>
            <motion.form
              className="space-y-6"
              onSubmit={handleSubmit(onSubmit)}
              variants={itemVariants}
            >
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Your Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={textFieldStyles}
                  />
                )}
              />

              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Your Email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={textFieldStyles}
                  />
                )}
              />

              <Controller
                name="date"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.date}>
                    <TextField
                      fullWidth
                      label="Select Date"
                      value={
                        field.value ? field.value.toLocaleDateString() : ""
                      }
                      error={!!errors.date}
                      helperText={errors.date?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarIcon />
                          </InputAdornment>
                        ),
                        readOnly: true,
                      }}
                      sx={textFieldStyles}
                    />
                    <div className="absolute opacity-0 w-full">
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        minDate={new Date()}
                        customInput={<CustomInput />}
                        dateFormat="MMMM d, yyyy"
                      />
                    </div>
                  </FormControl>
                )}
              />

              <Controller
                name="time"
                control={control}
                rules={{ required: "Time is required" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.time}>
                    <TextField
                      fullWidth
                      label="Select Time"
                      value={
                        field.value
                          ? field.value.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""
                      }
                      error={!!errors.time}
                      helperText={errors.time?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ClockIcon />
                          </InputAdornment>
                        ),
                        readOnly: true,
                      }}
                      sx={textFieldStyles}
                    />
                    <div className="absolute opacity-0 w-full">
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={30}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        customInput={<CustomInput />}
                      />
                    </div>
                  </FormControl>
                )}
              />

              <Controller
                name="persons"
                control={control}
                rules={{ required: "Please select number of persons" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.persons}>
                    <TextField
                      {...field}
                      select
                      label="Select Persons"
                      error={!!errors.persons}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <GroupIcon />
                          </InputAdornment>
                        ),
                      }}
                      sx={textFieldStyles}
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <MenuItem key={num} value={num}>
                          {num} {num === 1 ? "Person" : "People"}
                        </MenuItem>
                      ))}
                    </TextField>
                    {errors.persons && (
                      <FormHelperText>{errors.persons.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#DA9F5B",
                  py: 1.5,
                  mt: 2,
                  "&:hover": {
                    backgroundColor: "#c48f51",
                  },
                }}
              >
                Book Now
              </Button>
            </motion.form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Reservation;
