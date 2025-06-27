const mongoose = require("mongoose");
const { User } = require("./models/userModel");
const MenuItem = require("./models/menuModel");
const Category = require("./models/categoryModel");
const Resource = require("./models/resourceModel");
const connectDB = require("./config/db.js");

// Categories data
const categoriesData = [
  { name: "Hot Coffee" },
  { name: "Cold Coffee" },
  { name: "Tea & Hot Beverages" },
  { name: "Cold Beverages" },
  { name: "Pastries & Desserts" },
  { name: "Sandwiches & Wraps" },
  { name: "Breakfast" },
  { name: "Light Meals" },
  { name: "Snacks" },
  { name: "Ingredients & Resources" },
];

// Resources data
const resourcesData = [
  {
    name: "Coffee Beans (Espresso Blend)",
    unit: "g",
    currentStock: 5000,
    minimumStock: 1000,
    costPerUnit: 0.04,
    supplier: "Premium Coffee Suppliers",
  },
  {
    name: "Milk",
    unit: "ml",
    currentStock: 10000,
    minimumStock: 2000,
    costPerUnit: 0.003,
    supplier: "Local Dairy",
  },
  {
    name: "Chocolate Syrup",
    unit: "ml",
    currentStock: 2000,
    minimumStock: 500,
    costPerUnit: 0.02,
    supplier: "Sweet Supplies Co",
  },
  {
    name: "Caramel Syrup",
    unit: "ml",
    currentStock: 2000,
    minimumStock: 500,
    costPerUnit: 0.02,
    supplier: "Sweet Supplies Co",
  },
  {
    name: "Vanilla Syrup",
    unit: "ml",
    currentStock: 2000,
    minimumStock: 500,
    costPerUnit: 0.02,
    supplier: "Sweet Supplies Co",
  },
  {
    name: "Whipped Cream",
    unit: "g",
    currentStock: 1000,
    minimumStock: 200,
    costPerUnit: 0.01,
    supplier: "Local Dairy",
  },
  {
    name: "Tea Bags (Earl Grey)",
    unit: "pieces",
    currentStock: 200,
    minimumStock: 50,
    costPerUnit: 0.25,
    supplier: "Tea Traders Inc",
  },
  {
    name: "Tea Bags (Green Tea)",
    unit: "pieces",
    currentStock: 200,
    minimumStock: 50,
    costPerUnit: 0.25,
    supplier: "Tea Traders Inc",
  },
  {
    name: "Ice",
    unit: "g",
    currentStock: 5000,
    minimumStock: 1000,
    costPerUnit: 0.001,
    supplier: "In-house",
  },
  {
    name: "Croissant Dough",
    unit: "g",
    currentStock: 3000,
    minimumStock: 1000,
    costPerUnit: 0.015,
    supplier: "Bakery Supplies Ltd",
  },
  {
    name: "Bagels",
    unit: "pieces",
    currentStock: 50,
    minimumStock: 20,
    costPerUnit: 1.2,
    supplier: "Local Bakery",
  },
  {
    name: "Bread (Sourdough)",
    unit: "pieces",
    currentStock: 100,
    minimumStock: 40,
    costPerUnit: 0.3,
    supplier: "Local Bakery",
  },
  {
    name: "Eggs",
    unit: "pieces",
    currentStock: 120,
    minimumStock: 50,
    costPerUnit: 0.35,
    supplier: "Local Farm",
  },
  {
    name: "Bacon",
    unit: "g",
    currentStock: 2000,
    minimumStock: 500,
    costPerUnit: 0.08,
    supplier: "Local Butcher",
  },
  {
    name: "Avocado",
    unit: "pieces",
    currentStock: 30,
    minimumStock: 10,
    costPerUnit: 1.5,
    supplier: "Local Produce",
  },
];

const createCategoriesResourcesAndMenuItems = async () => {
  try {
    console.log("=".repeat(50));
    console.log("STARTING SEEDER PROCESS");
    console.log("=".repeat(50));

    // Check and clear existing data
    await MenuItem.deleteMany({});
    await Category.deleteMany({});
    await Resource.deleteMany({});

    console.log("\n📁 Creating Categories...");
    const createdCategories = await Category.insertMany(categoriesData);

    // Create category map
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    console.log("\n📦 Creating Resources...");
    // Add category to resources
    const resourcesWithCategory = resourcesData.map((resource) => ({
      ...resource,
      category: categoryMap["Ingredients & Resources"],
    }));

    const createdResources = await Resource.insertMany(resourcesWithCategory);

    // Create resource map for easy reference
    const resourceMap = {};
    createdResources.forEach((resource) => {
      resourceMap[resource.name] = resource._id;
    });

    // Menu items data with ingredients
    const menuItemsData = [
      // Hot Coffee
      {
        name: "Espresso",
        description: "Rich, bold shot of coffee with a smooth crema layer",
        price: 2.5,
        category: categoryMap["Hot Coffee"],
        image: "uploads/espresso.jpg",
        preparationTime: 3,
        ingredients: [
          {
            resource: resourceMap["Coffee Beans (Espresso Blend)"],
            quantity: 18,
          },
        ],
      },
      {
        name: "Double Espresso",
        description: "Two shots of rich espresso for extra strength",
        price: 3.5,
        category: categoryMap["Hot Coffee"],
        image: "uploads/double-espresso.jpg",
        preparationTime: 4,
        ingredients: [
          {
            resource: resourceMap["Coffee Beans (Espresso Blend)"],
            quantity: 36,
          },
        ],
      },
      {
        name: "Americano",
        description: "Espresso with hot water for a smooth, rich taste",
        price: 3.0,
        category: categoryMap["Hot Coffee"],
        image: "uploads/americano.jpg",
        preparationTime: 4,
        ingredients: [
          {
            resource: resourceMap["Coffee Beans (Espresso Blend)"],
            quantity: 18,
          },
        ],
      },
      {
        name: "Cappuccino",
        description: "Perfect balance of espresso, steamed milk, and foam",
        price: 4.5,
        category: categoryMap["Hot Coffee"],
        image: "uploads/cappuccino.jpg",
        preparationTime: 5,
        ingredients: [
          {
            resource: resourceMap["Coffee Beans (Espresso Blend)"],
            quantity: 18,
          },
          {
            resource: resourceMap["Milk"],
            quantity: 180,
          },
        ],
      },
      {
        name: "Latte",
        description: "Smooth espresso with velvety steamed milk",
        price: 4.75,
        category: categoryMap["Hot Coffee"],
        image: "uploads/latte.jpg",
        preparationTime: 5,
        ingredients: [
          {
            resource: resourceMap["Coffee Beans (Espresso Blend)"],
            quantity: 18,
          },
          {
            resource: resourceMap["Milk"],
            quantity: 240,
          },
        ],
      },
      {
        name: "Mocha",
        description:
          "Rich espresso with chocolate syrup, steamed milk, and whipped cream",
        price: 5.25,
        category: categoryMap["Hot Coffee"],
        image: "uploads/mocha.jpg",
        preparationTime: 6,
        ingredients: [
          {
            resource: resourceMap["Coffee Beans (Espresso Blend)"],
            quantity: 18,
          },
          {
            resource: resourceMap["Milk"],
            quantity: 180,
          },
          {
            resource: resourceMap["Chocolate Syrup"],
            quantity: 30,
          },
          {
            resource: resourceMap["Whipped Cream"],
            quantity: 30,
          },
        ],
      },
      {
        name: "Caramel Macchiato",
        description:
          "Espresso with vanilla syrup, steamed milk, and caramel drizzle",
        price: 5.5,
        category: categoryMap["Hot Coffee"],
        image: "uploads/caramel-macchiato.jpg",
        preparationTime: 6,
        ingredients: [
          {
            resource: resourceMap["Coffee Beans (Espresso Blend)"],
            quantity: 18,
          },
          {
            resource: resourceMap["Milk"],
            quantity: 240,
          },
          {
            resource: resourceMap["Vanilla Syrup"],
            quantity: 15,
          },
          {
            resource: resourceMap["Caramel Syrup"],
            quantity: 15,
          },
        ],
      },
      {
        name: "Flat White",
        description: "Strong espresso with microfoam for a velvety texture",
        price: 4.75,
        category: categoryMap["Hot Coffee"],
        image: "uploads/flat-white.jpg",
        preparationTime: 5,
        ingredients: [
          {
            resource: resourceMap["Coffee Beans (Espresso Blend)"],
            quantity: 36,
          },
          {
            resource: resourceMap["Milk"],
            quantity: 180,
          },
        ],
      },

      // Cold Coffee
      {
        name: "Iced Coffee",
        description: "Chilled coffee served over ice with milk",
        price: 4.0,
        category: categoryMap["Cold Coffee"],
        image: "uploads/iced-coffee.jpg",
        preparationTime: 4,
        ingredients: [
          {
            resource: resourceMap["Coffee Beans (Espresso Blend)"],
            quantity: 18,
          },
          {
            resource: resourceMap["Milk"],
            quantity: 120,
          },
          {
            resource: resourceMap["Ice"],
            quantity: 200,
          },
        ],
      },
      {
        name: "Iced Latte",
        description: "Espresso with cold milk over ice",
        price: 4.75,
        category: categoryMap["Cold Coffee"],
        image: "uploads/iced-latte.jpg",
        preparationTime: 4,
        ingredients: [
          {
            resource: resourceMap["Coffee Beans (Espresso Blend)"],
            quantity: 36,
          },
          {
            resource: resourceMap["Milk"],
            quantity: 240,
          },
          {
            resource: resourceMap["Ice"],
            quantity: 200,
          },
        ],
      },
      {
        name: "Iced Mocha",
        description:
          "Chocolate, espresso and milk served over ice, topped with whipped cream",
        price: 5.5,
        category: categoryMap["Cold Coffee"],
        image: "uploads/iced-mocha.jpg",
        preparationTime: 5,
        ingredients: [
          {
            resource: resourceMap["Coffee Beans (Espresso Blend)"],
            quantity: 36,
          },
          {
            resource: resourceMap["Milk"],
            quantity: 240,
          },
          {
            resource: resourceMap["Chocolate Syrup"],
            quantity: 30,
          },
          {
            resource: resourceMap["Whipped Cream"],
            quantity: 30,
          },
          {
            resource: resourceMap["Ice"],
            quantity: 200,
          },
        ],
      },
      {
        name: "Cold Brew",
        description: "Smooth, slow-steeped cold coffee",
        price: 4.5,
        category: categoryMap["Cold Coffee"],
        image: "uploads/cold-brew.jpg",
        preparationTime: 2, // Pre-made, just needs to be served
        ingredients: [
          {
            resource: resourceMap["Coffee Beans (Espresso Blend)"],
            quantity: 50, // More beans used due to extraction method
          },
          {
            resource: resourceMap["Ice"],
            quantity: 200,
          },
        ],
      },
      {
        name: "Frappé",
        description: "Blended iced coffee drink with milk and sweetener",
        price: 5.75,
        category: categoryMap["Cold Coffee"],
        image: "uploads/frappe.jpg",
        preparationTime: 7,
        ingredients: [
          {
            resource: resourceMap["Coffee Beans (Espresso Blend)"],
            quantity: 36,
          },
          {
            resource: resourceMap["Milk"],
            quantity: 240,
          },
          {
            resource: resourceMap["Ice"],
            quantity: 300,
          },
          {
            resource: resourceMap["Vanilla Syrup"],
            quantity: 20,
          },
          {
            resource: resourceMap["Whipped Cream"],
            quantity: 30,
          },
        ],
      },

      // Tea & Hot Beverages
      {
        name: "Earl Grey Tea",
        description: "Classic black tea with bergamot flavor",
        price: 3.0,
        category: categoryMap["Tea & Hot Beverages"],
        image: "uploads/earl-grey.jpg",
        preparationTime: 4,
        ingredients: [
          {
            resource: resourceMap["Tea Bags (Earl Grey)"],
            quantity: 1,
          },
        ],
      },
      {
        name: "Green Tea",
        description: "Light and refreshing Japanese green tea",
        price: 3.0,
        category: categoryMap["Tea & Hot Beverages"],
        image: "uploads/green-tea.jpg",
        preparationTime: 4,
        ingredients: [
          {
            resource: resourceMap["Tea Bags (Green Tea)"],
            quantity: 1,
          },
        ],
      },
      {
        name: "Chai Latte",
        description: "Spiced tea with steamed milk",
        price: 4.5,
        category: categoryMap["Tea & Hot Beverages"],
        image: "uploads/chai-latte.jpg",
        preparationTime: 5,
        ingredients: [
          {
            resource: resourceMap["Tea Bags (Earl Grey)"],
            quantity: 1,
          },
          {
            resource: resourceMap["Milk"],
            quantity: 240,
          },
          {
            resource: resourceMap["Vanilla Syrup"],
            quantity: 15,
          },
        ],
      },
      {
        name: "Hot Chocolate",
        description: "Rich, creamy chocolate drink",
        price: 4.25,
        category: categoryMap["Tea & Hot Beverages"],
        image: "uploads/hot-chocolate.jpg",
        preparationTime: 5,
        ingredients: [
          {
            resource: resourceMap["Milk"],
            quantity: 240,
          },
          {
            resource: resourceMap["Chocolate Syrup"],
            quantity: 45,
          },
          {
            resource: resourceMap["Whipped Cream"],
            quantity: 30,
          },
        ],
      },

      // Cold Beverages
      {
        name: "Iced Tea",
        description: "Refreshing cold tea with lemon",
        price: 3.5,
        category: categoryMap["Cold Beverages"],
        image: "uploads/iced-tea.jpg",
        preparationTime: 2,
        ingredients: [
          {
            resource: resourceMap["Tea Bags (Earl Grey)"],
            quantity: 1,
          },
          {
            resource: resourceMap["Ice"],
            quantity: 300,
          },
        ],
      },
      {
        name: "Lemonade",
        description: "Homemade sweet and tangy lemonade",
        price: 3.75,
        category: categoryMap["Cold Beverages"],
        image: "uploads/lemonade.jpg",
        preparationTime: 3,
        ingredients: [
          {
            resource: resourceMap["Ice"],
            quantity: 300,
          },
        ],
      },
      {
        name: "Sparkling Water",
        description: "Refreshing carbonated water",
        price: 2.5,
        category: categoryMap["Cold Beverages"],
        image: "uploads/sparkling-water.jpg",
        preparationTime: 1,
        ingredients: [
          {
            resource: resourceMap["Ice"],
            quantity: 200,
          },
        ],
      },

      // Pastries & Desserts
      {
        name: "Croissant",
        description: "Buttery, flaky French pastry",
        price: 3.5,
        category: categoryMap["Pastries & Desserts"],
        image: "uploads/croissant.jpg",
        preparationTime: 1, // Just needs to be served
        ingredients: [
          {
            resource: resourceMap["Croissant Dough"],
            quantity: 100,
          },
        ],
      },
      {
        name: "Chocolate Croissant",
        description: "Flaky croissant with rich chocolate filling",
        price: 4.0,
        category: categoryMap["Pastries & Desserts"],
        image: "uploads/chocolate-croissant.jpg",
        preparationTime: 1,
        ingredients: [
          {
            resource: resourceMap["Croissant Dough"],
            quantity: 100,
          },
          {
            resource: resourceMap["Chocolate Syrup"],
            quantity: 30,
          },
        ],
      },
      {
        name: "Blueberry Muffin",
        description: "Moist muffin packed with fresh blueberries",
        price: 3.75,
        category: categoryMap["Pastries & Desserts"],
        image: "uploads/blueberry-muffin.jpg",
        preparationTime: 1,
        ingredients: [],
      },
      {
        name: "Chocolate Chip Cookie",
        description: "Classic cookie with melty chocolate chips",
        price: 2.5,
        category: categoryMap["Pastries & Desserts"],
        image: "uploads/chocolate-chip-cookie.jpg",
        preparationTime: 1,
        ingredients: [],
      },
      {
        name: "Cheesecake Slice",
        description: "Creamy New York-style cheesecake",
        price: 5.5,
        category: categoryMap["Pastries & Desserts"],
        image: "uploads/cheesecake.jpg",
        preparationTime: 1,
        ingredients: [],
      },

      // Sandwiches & Wraps
      {
        name: "Turkey & Swiss Sandwich",
        description: "Sliced turkey with Swiss cheese on sourdough",
        price: 7.5,
        category: categoryMap["Sandwiches & Wraps"],
        image: "uploads/turkey-sandwich.jpg",
        preparationTime: 6,
        ingredients: [
          {
            resource: resourceMap["Bread (Sourdough)"],
            quantity: 2,
          },
        ],
      },
      {
        name: "Veggie Wrap",
        description: "Fresh vegetables with hummus in a whole wheat wrap",
        price: 7.0,
        category: categoryMap["Sandwiches & Wraps"],
        image: "uploads/veggie-wrap.jpg",
        preparationTime: 5,
        ingredients: [],
      },
      {
        name: "Chicken Caesar Wrap",
        description: "Grilled chicken with romaine and Caesar dressing",
        price: 8.0,
        category: categoryMap["Sandwiches & Wraps"],
        image: "uploads/caesar-wrap.jpg",
        preparationTime: 6,
        ingredients: [],
      },

      // Breakfast
      {
        name: "Avocado Toast",
        description: "Sourdough toast with smashed avocado and spices",
        price: 8.5,
        category: categoryMap["Breakfast"],
        image: "uploads/avocado-toast.jpg",
        preparationTime: 7,
        ingredients: [
          {
            resource: resourceMap["Bread (Sourdough)"],
            quantity: 1,
          },
          {
            resource: resourceMap["Avocado"],
            quantity: 0.5,
          },
        ],
      },
      {
        name: "Breakfast Bagel",
        description: "Toasted bagel with cream cheese, tomato, and cucumber",
        price: 6.5,
        category: categoryMap["Breakfast"],
        image: "uploads/breakfast-bagel.jpg",
        preparationTime: 5,
        ingredients: [
          {
            resource: resourceMap["Bagels"],
            quantity: 1,
          },
        ],
      },
      {
        name: "Bacon & Egg Sandwich",
        description: "Fried egg and crispy bacon on a brioche bun",
        price: 8.0,
        category: categoryMap["Breakfast"],
        image: "uploads/bacon-egg-sandwich.jpg",
        preparationTime: 8,
        ingredients: [
          {
            resource: resourceMap["Bread (Sourdough)"],
            quantity: 2,
          },
          {
            resource: resourceMap["Eggs"],
            quantity: 1,
          },
          {
            resource: resourceMap["Bacon"],
            quantity: 50,
          },
        ],
      },

      // Light Meals
      {
        name: "Quiche Lorraine",
        description: "Classic French quiche with bacon and cheese",
        price: 9.5,
        category: categoryMap["Light Meals"],
        image: "uploads/quiche.jpg",
        preparationTime: 2, // Pre-made, just needs heating
        ingredients: [],
      },
      {
        name: "Greek Salad",
        description: "Fresh vegetables with feta and olives",
        price: 10.0,
        category: categoryMap["Light Meals"],
        image: "uploads/greek-salad.jpg",
        preparationTime: 7,
        ingredients: [],
      },

      // Snacks
      {
        name: "Granola Bar",
        description: "Homemade oats and honey granola bar",
        price: 3.0,
        category: categoryMap["Snacks"],
        image: "uploads/granola-bar.jpg",
        preparationTime: 1,
        ingredients: [],
      },
      {
        name: "Mixed Nuts",
        description: "Assorted roasted nuts with sea salt",
        price: 4.0,
        category: categoryMap["Snacks"],
        image: "uploads/mixed-nuts.jpg",
        preparationTime: 1,
        ingredients: [],
      },
    ];

    console.log("\n🍽️ Creating Menu Items...");
    const createdMenuItems = await MenuItem.insertMany(menuItemsData);

    console.log("\n✅ SEEDER COMPLETED SUCCESSFULLY!");
    console.log(`📊 Summary:`);
    console.log(`   • Categories created: ${createdCategories.length}`);
    console.log(`   • Resources created: ${createdResources.length}`);
    console.log(`   • Menu items created: ${createdMenuItems.length}`);
  } catch (error) {
    console.error("❌ SEEDER FAILED:", error);
    console.error("Full error:", error.stack);
  }
};

// Main execution function
const runSeeder = async () => {
  try {
    console.log("🚀 Initializing seeder...");
    await connectDB();
    console.log("✅ Database connected successfully!");

    await createCategoriesResourcesAndMenuItems();
  } catch (error) {
    console.error("❌ Fatal error:", error);
  } finally {
    console.log("🔌 Closing database connection...");
    await mongoose.connection.close();
    console.log("✅ Database connection closed.");
    process.exit(0);
  }
};

// Run the seeder
runSeeder();
