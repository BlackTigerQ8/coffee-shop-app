import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaClock,
  FaUsers,
} from "react-icons/fa";

const InputField = ({ icon: Icon, error, children }) => (
  <motion.div className="relative w-full" whileTap={{ scale: 0.995 }}>
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary z-10">
      <Icon />
    </div>
    {children}
    {error && (
      <span className="text-red-500 text-sm absolute -bottom-6 left-0">
        {error}
      </span>
    )}
  </motion.div>
);

const inputStyles =
  "w-full p-4 pl-12 bg-[#33211D] border border-primary text-white rounded focus:outline-none focus:border-2 transition-all duration-300 placeholder:text-gray-400";

const Reservation = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const {
    register,
    handleSubmit,
    control,
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

          {/* Right Side */}
          <motion.div
            className="bg-[rgba(51,33,29,0.8)] p-8 lg:p-20 rounded-lg"
            variants={itemVariants}
          >
            <motion.h1
              className="text-3xl text-center mb-12"
              variants={itemVariants}
            >
              Book Your Table
            </motion.h1>
            <motion.form
              className="space-y-8"
              onSubmit={handleSubmit(onSubmit)}
              variants={itemVariants}
            >
              <InputField icon={FaUser} error={errors.name?.message}>
                <input
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  placeholder="Your Name"
                  className={inputStyles}
                />
              </InputField>

              <InputField icon={FaEnvelope} error={errors.email?.message}>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="Your Email"
                  className={inputStyles}
                />
              </InputField>

              <InputField icon={FaCalendar} error={errors.date?.message}>
                <Controller
                  control={control}
                  name="date"
                  rules={{ required: "Date is required" }}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      placeholderText="Select Date"
                      className={inputStyles}
                      minDate={new Date()}
                      dateFormat="MMMM d, yyyy"
                    />
                  )}
                />
              </InputField>

              <InputField icon={FaClock} error={errors.time?.message}>
                <Controller
                  control={control}
                  name="time"
                  rules={{ required: "Time is required" }}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      placeholderText="Select Time"
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      className={inputStyles}
                    />
                  )}
                />
              </InputField>

              <InputField icon={FaUsers} error={errors.persons?.message}>
                <select
                  {...register("persons", {
                    required: "Please select number of persons",
                  })}
                  className={inputStyles}
                >
                  <option value="" className="bg-secondary">
                    Select Persons
                  </option>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num} className="bg-secondary">
                      {num} {num === 1 ? "Person" : "People"}
                    </option>
                  ))}
                </select>
              </InputField>

              <motion.button
                type="submit"
                className="w-full btn-primary py-4 font-bold rounded-md mt-8"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                Book Now
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Reservation;
