const ServiceItem = ({ image, icon, title, description }) => (
  <div className="lg:w-1/2 mb-8">
    <div className="flex flex-col sm:flex-row items-center">
      <div className="sm:w-1/3 mb-4 sm:mb-0">
        <img className="w-full rounded" src={image} alt={title} />
      </div>
      <div className="sm:w-2/3 sm:pl-6">
        <h4 className="flex items-center text-xl mb-2">
          <i className={`${icon} text-primary mr-2`}></i>
          {title}
        </h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);

const Services = () => {
  const services = [
    {
      image: "img/service-1.jpg",
      icon: "fa fa-truck",
      title: "Fastest Door Delivery",
      description:
        "Sit lorem ipsum et diam elitr est dolor sed duo. Guberg sea et et lorem dolor sed est sit invidunt, dolore tempor diam ipsum takima erat tempor",
    },
    // Add other services...
  ];

  return (
    <div className="container mx-auto py-20">
      <div className="text-center mb-16">
        <h4 className="text-primary uppercase tracking-[5px]">Our Services</h4>
        <h1 className="text-4xl font-bold">Fresh & Organic Beans</h1>
      </div>

      <div className="flex flex-wrap">
        {services.map((service, index) => (
          <ServiceItem key={index} {...service} />
        ))}
      </div>
    </div>
  );
};

export default Services;
