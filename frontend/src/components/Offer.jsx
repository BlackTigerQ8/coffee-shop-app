const Offer = () => {
  return (
    <div className="relative my-20 py-20 text-center bg-secondary text-white overlay-top overlay-bottom offer">
      <div className="container mx-auto py-20">
        <h1 className="text-primary text-6xl mt-3">50% OFF</h1>
        <h1 className="text-4xl mb-3">Sunday Special Offer</h1>
        <h4 className="font-normal mb-12">
          Only for Sunday from 1st Jan to 30th Jan 2045
        </h4>

        <form className="flex justify-center mb-4">
          <div className="flex max-w-md w-full">
            <input
              type="text"
              className="flex-1 p-4 bg-white text-gray-900"
              placeholder="Your Email"
            />
            <button className="btn-primary whitespace-nowrap" type="submit">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Offer;
