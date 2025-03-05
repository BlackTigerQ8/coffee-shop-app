const About = () => {
  return (
    <div className="container mx-auto py-20">
      <div className="text-center mb-16">
        <h4 className="text-primary uppercase tracking-[5px]">About Us</h4>
        <h1 className="text-4xl font-bold">Serving Since 1950</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="px-4">
          <h1 className="text-3xl mb-3">Our Story</h1>
          <h5 className="text-xl mb-3">
            Eos kasd eos dolor vero vero, lorem stet diam rebum. Ipsum amet sed
            vero dolor sea
          </h5>
          <p className="mb-4">
            Takimata sed vero vero no sit sed, justo clita duo no duo amet et,
            nonumy kasd sed dolor eos diam lorem eirmod. Amet sit amet amet no.
          </p>
          <button className="btn-primary">Learn More</button>
        </div>

        <div className="relative min-h-[500px]">
          <img
            src="img/about.png"
            alt="About"
            className="absolute w-full h-full object-cover"
          />
        </div>

        <div className="px-4">
          <h1 className="text-3xl mb-3">Our Vision</h1>
          <p className="mb-4">
            Invidunt lorem justo sanctus clita. Erat lorem labore ea, justo
            dolor lorem ipsum ut sed eos, ipsum et dolor kasd sit ea justo.
          </p>
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex items-center mb-3">
              <i className="fas fa-check text-primary mr-3"></i>
              <h5>Lorem ipsum dolor sit amet</h5>
            </div>
          ))}
          <button className="btn-primary">Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default About;
