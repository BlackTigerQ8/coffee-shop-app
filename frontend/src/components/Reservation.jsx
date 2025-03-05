const Reservation = () => {
  return (
    <div className="container mx-auto my-20">
      <div className="relative bg-secondary text-white p-8 lg:p-0 overlay-top overlay-bottom reservation">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side */}
          <div className="my-5 lg:my-0">
            <div className="p-5 lg:p-20">
              <div className="mb-8">
                <h1 className="text-primary text-6xl">30% OFF</h1>
                <h1 className="text-3xl">For Online Reservation</h1>
              </div>
              <p className="mb-4">
                Lorem justo clita erat lorem labore ea, justo dolor lorem ipsum
                ut sed eos, ipsum et dolor kasd sit ea justo.
              </p>
              <ul className="space-y-2">
                {[1, 2, 3].map((_, index) => (
                  <li key={index} className="flex items-center">
                    <i className="fas fa-check text-primary mr-3"></i>
                    Lorem ipsum dolor sit amet
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Side */}
          <div className="bg-[rgba(51,33,29,0.8)] p-8 lg:p-20">
            <h1 className="text-3xl text-center mb-8">Book Your Table</h1>
            <form className="space-y-4">
              <input
                type="text"
                className="w-full p-4 bg-transparent border border-primary"
                placeholder="Name"
                required
              />
              <input
                type="email"
                className="w-full p-4 bg-transparent border border-primary"
                placeholder="Email"
                required
              />
              <input
                type="text"
                className="w-full p-4 bg-transparent border border-primary"
                placeholder="Date"
                required
              />
              <input
                type="text"
                className="w-full p-4 bg-transparent border border-primary"
                placeholder="Time"
                required
              />
              <select className="w-full p-4 bg-transparent border border-primary text-gray-400">
                <option value="">Person</option>
                <option value="1">Person 1</option>
                <option value="2">Person 2</option>
                <option value="3">Person 3</option>
                <option value="4">Person 4</option>
              </select>
              <button
                type="submit"
                className="w-full btn-primary py-4 font-bold"
              >
                Book Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
