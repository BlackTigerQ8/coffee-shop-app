const Footer = () => {
  return (
    <footer className="bg-secondary text-white mt-20 pt-20 relative overlay-top footer">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {/* Get In Touch */}
          <div>
            <h4 className="text-white uppercase mb-4 tracking-[3px]">
              Get In Touch
            </h4>
            <p className="mb-2">
              <i className="fa fa-map-marker-alt mr-2"></i>
              123 Street, New York, USA
            </p>
            <p className="mb-2">
              <i className="fa fa-phone-alt mr-2"></i>
              +012 345 67890
            </p>
            <p>
              <i className="fa fa-envelope mr-2"></i>
              info@example.com
            </p>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-white uppercase mb-4 tracking-[3px]">
              Follow Us
            </h4>
            <p className="mb-4">
              Amet elitr vero magna sed ipsum sit kasd sea elitr lorem rebum
            </p>
            <div className="flex space-x-2">
              {["twitter", "facebook-f", "linkedin-in", "instagram"].map(
                (icon) => (
                  <a
                    key={icon}
                    href="#"
                    className="w-10 h-10 border border-white rounded flex items-center justify-center hover:bg-primary hover:border-primary transition-colors"
                  >
                    <i className={`fab fa-${icon}`}></i>
                  </a>
                )
              )}
            </div>
          </div>

          {/* Open Hours */}
          <div>
            <h4 className="text-white uppercase mb-4 tracking-[3px]">
              Open Hours
            </h4>
            <div>
              <h6 className="text-white uppercase">Monday - Friday</h6>
              <p className="mb-4">8.00 AM - 8.00 PM</p>
              <h6 className="text-white uppercase">Saturday - Sunday</h6>
              <p>2.00 PM - 8.00 PM</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white uppercase mb-4 tracking-[3px]">
              Newsletter
            </h4>
            <p className="mb-4">
              Amet elitr vero magna sed ipsum sit kasd sea elitr lorem rebum
            </p>
            <div className="flex">
              <input
                type="text"
                className="form-input w-full p-4 bg-transparent border border-white"
                placeholder="Your Email"
              />
              <button className="btn-primary whitespace-nowrap">Sign Up</button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center border-t border-gray-800 mt-8 py-4">
          <p className="mb-2">
            Copyright &copy;{" "}
            <a href="#" className="font-bold">
              Domain
            </a>
            . All Rights Reserved.
          </p>
          <p>
            Designed by{" "}
            <a href="https://htmlcodex.com" className="font-bold">
              HTML Codex
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
