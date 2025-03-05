const Navbar = () => {
  return (
    <div className="container-fluid p-0 nav-bar bg-[#33211D]">
      <nav className="navbar py-3">
        <div className="container px-4">
          <a href="/" className="navbar-brand px-lg-4 m-0">
            <h1 className="m-0 text-4xl text-uppercase text-white">KOPPEE</h1>
          </a>

          <button className="lg:hidden" type="button">
            <span className="block w-6 h-px bg-white mb-1"></span>
            <span className="block w-6 h-px bg-white mb-1"></span>
            <span className="block w-6 h-px bg-white"></span>
          </button>

          <div className="hidden lg:flex items-center space-x-8">
            <a href="/" className="text-white hover:text-primary">
              Home
            </a>
            <a href="/about" className="text-white hover:text-primary">
              About
            </a>
            <a href="/service" className="text-white hover:text-primary">
              Service
            </a>
            <a href="/menu" className="text-white hover:text-primary">
              Menu
            </a>

            <div className="relative group">
              <button className="text-white hover:text-primary">Pages</button>
              <div className="absolute hidden group-hover:block bg-white mt-2 py-2 w-48 rounded-lg shadow-lg">
                <a
                  href="/reservation"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Reservation
                </a>
                <a
                  href="/testimonial"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Testimonial
                </a>
              </div>
            </div>

            <a href="/contact" className="text-white hover:text-primary">
              Contact
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
