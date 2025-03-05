import Menu1 from "../assets/menu-1.jpg";
import Menu2 from "../assets/menu-2.jpg";
import Menu3 from "../assets/menu-3.jpg";

const MenuItem = ({ image, price, name, description }) => (
  <div className="flex items-center mb-8">
    <div className="w-1/4 sm:w-1/6">
      <img className="w-full rounded-full mb-3" src={image} alt={name} />
      <h5 className="text-center text-primary">${price}</h5>
    </div>
    <div className="w-3/4 sm:w-5/6 pl-4">
      <h4 className="text-xl mb-2">{name}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const Menu = () => {
  const menuItems = {
    hot: [
      {
        image: Menu1,
        price: "5",
        name: "Black Coffee",
        description:
          "Sit lorem ipsum et diam elitr est dolor sed duo guberg sea et et lorem dolor",
      },
      {
        image: Menu2,
        price: "5",
        name: "Black Coffee",
        description:
          "Sit lorem ipsum et diam elitr est dolor sed duo guberg sea et et lorem dolor",
      },
      {
        image: Menu3,
        price: "5",
        name: "Black Coffee",
        description:
          "Sit lorem ipsum et diam elitr est dolor sed duo guberg sea et et lorem dolor",
      },
    ],
    cold: [
      {
        image: Menu1,
        price: "5",
        name: "Black Coffee",
        description:
          "Sit lorem ipsum et diam elitr est dolor sed duo guberg sea et et lorem dolor",
      },
      {
        image: Menu2,
        price: "5",
        name: "Black Coffee",
        description:
          "Sit lorem ipsum et diam elitr est dolor sed duo guberg sea et et lorem dolor",
      },
      {
        image: Menu3,
        price: "5",
        name: "Black Coffee",
        description:
          "Sit lorem ipsum et diam elitr est dolor sed duo guberg sea et et lorem dolor",
      },
    ],
  };

  return (
    <div className="container mx-auto py-20">
      <div className="text-center mb-16">
        <h4 className="text-primary uppercase tracking-[5px]">
          Menu & Pricing
        </h4>
        <h1 className="text-4xl font-bold">Competitive Pricing</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl mb-8">Hot Coffee</h1>
          {menuItems.hot.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </div>
        <div>
          <h1 className="text-3xl mb-8">Cold Coffee</h1>
          {menuItems.cold.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
