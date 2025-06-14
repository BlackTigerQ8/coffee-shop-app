const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { User } = require("./models/userModel");
const MenuItem = require("./models/menuModel");
const Category = require("./models/categoryModel");
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
];

const createCategoriesAndMenuItems = async () => {
  try {
    console.log("=".repeat(50));
    console.log("STARTING SEEDER PROCESS");
    console.log("=".repeat(50));

    // Check existing data
    const existingCategories = await Category.find();
    const existingMenuItems = await MenuItem.find();

    console.log(`📊 Current Database Status:`);
    console.log(`   • Existing Categories: ${existingCategories.length}`);
    console.log(`   • Existing Menu Items: ${existingMenuItems.length}`);

    if (existingCategories.length > 0 || existingMenuItems.length > 0) {
      console.log("\n🧹 Clearing existing data...");
      await MenuItem.deleteMany({});
      await Category.deleteMany({});
      console.log("✅ Database cleared!");
    }

    console.log("\n📁 Creating Categories...");
    console.log("-".repeat(30));

    // Create categories one by one with logging
    const createdCategories = [];
    for (let i = 0; i < categoriesData.length; i++) {
      const categoryData = categoriesData[i];
      try {
        const newCategory = new Category(categoryData);
        const savedCategory = await newCategory.save();
        createdCategories.push(savedCategory);
        console.log(
          `✅ Category ${i + 1}/${categoriesData.length}: "${
            savedCategory.name
          }" created (ID: ${savedCategory._id})`
        );
      } catch (error) {
        console.error(
          `❌ Error creating category "${categoryData.name}":`,
          error.message
        );
      }
    }

    console.log(
      `\n🎉 Successfully created ${createdCategories.length} categories!`
    );

    // Create a map for easy category lookup
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    console.log("\n📋 Category Map:");
    Object.entries(categoryMap).forEach(([name, id]) => {
      console.log(`   "${name}" -> ${id}`);
    });

    // Menu items data
    const menuItemsData = [
      // Hot Coffee
      {
        name: "Espresso",
        description: "Rich, bold shot of coffee with a smooth crema layer",
        price: 2.5,
        category: categoryMap["Hot Coffee"],
        image: "uploads/espresso.jpg",
      },
      {
        name: "Americano",
        description:
          "Espresso shots topped with hot water for a clean, crisp taste",
        price: 3.25,
        category: categoryMap["Hot Coffee"],
        image: "uploads/americano.jpg",
      },
      {
        name: "Cappuccino",
        description: "Perfect balance of espresso, steamed milk, and foam",
        price: 4.5,
        category: categoryMap["Hot Coffee"],
        image: "uploads/cappuccino.jpg",
      },
      {
        name: "Latte",
        description:
          "Smooth espresso with steamed milk and a light layer of foam",
        price: 4.75,
        category: categoryMap["Hot Coffee"],
        image: "uploads/latte.jpg",
      },
      {
        name: "Macchiato",
        description: "Espresso 'marked' with a dollop of foamed milk",
        price: 4.25,
        category: categoryMap["Hot Coffee"],
        image: "uploads/macchiato.jpg",
      },
      {
        name: "Mocha",
        description:
          "Rich espresso with chocolate syrup, steamed milk, and whipped cream",
        price: 5.25,
        category: categoryMap["Hot Coffee"],
        image: "uploads/mocha.jpg",
      },
      {
        name: "French Press",
        description:
          "Full-bodied coffee brewed with coarse grounds for 4 minutes",
        price: 3.75,
        category: categoryMap["Hot Coffee"],
        image: "uploads/french-press.jpg",
      },
      {
        name: "Turkish Coffee",
        description: "Traditional finely ground coffee brewed in a cezve",
        price: 4.0,
        category: categoryMap["Hot Coffee"],
        image: "uploads/turkish-coffee.jpg",
      },

      // Cold Coffee
      {
        name: "Iced Coffee",
        description: "Refreshing cold brew served over ice",
        price: 3.5,
        category: categoryMap["Cold Coffee"],
        image: "uploads/iced-coffee.jpg",
      },
      {
        name: "Cold Brew",
        description: "Smooth, low-acid coffee steeped for 12 hours",
        price: 4.25,
        category: categoryMap["Cold Coffee"],
        image: "uploads/cold-brew.jpg",
      },
      {
        name: "Iced Latte",
        description: "Espresso and cold milk served over ice",
        price: 4.95,
        category: categoryMap["Cold Coffee"],
        image: "uploads/iced-latte.jpg",
      },
      {
        name: "Iced Caramel Macchiato",
        description:
          "Vanilla syrup, milk, espresso, and caramel drizzle over ice",
        price: 5.75,
        category: categoryMap["Cold Coffee"],
        image: "uploads/iced-caramel-macchiato.jpg",
      },
      {
        name: "Frappé",
        description:
          "Blended iced coffee with milk and topped with whipped cream",
        price: 5.5,
        category: categoryMap["Cold Coffee"],
        image: "uploads/frappe.jpg",
      },
      {
        name: "Nitro Cold Brew",
        description: "Cold brew infused with nitrogen for a creamy texture",
        price: 4.75,
        category: categoryMap["Cold Coffee"],
        image: "uploads/nitro-cold-brew.jpg",
      },

      // Tea & Hot Beverages
      {
        name: "Earl Grey Tea",
        description: "Classic black tea with bergamot oil",
        price: 2.75,
        category: categoryMap["Tea & Hot Beverages"],
        image: "uploads/earl-grey.jpg",
      },
      {
        name: "Green Tea",
        description: "Light and refreshing antioxidant-rich tea",
        price: 2.5,
        category: categoryMap["Tea & Hot Beverages"],
        image: "uploads/green-tea.jpg",
      },
      {
        name: "Chamomile Tea",
        description: "Soothing herbal tea perfect for relaxation",
        price: 2.75,
        category: categoryMap["Tea & Hot Beverages"],
        image: "uploads/chamomile-tea.jpg",
      },
      {
        name: "Chai Latte",
        description: "Spiced tea blend with steamed milk and warming spices",
        price: 4.25,
        category: categoryMap["Tea & Hot Beverages"],
        image: "uploads/chai-latte.jpg",
      },
      {
        name: "Hot Chocolate",
        description: "Rich, creamy chocolate drink topped with whipped cream",
        price: 3.95,
        category: categoryMap["Tea & Hot Beverages"],
        image: "uploads/hot-chocolate.jpg",
      },
      {
        name: "Matcha Latte",
        description: "Premium matcha powder with steamed milk",
        price: 4.75,
        category: categoryMap["Tea & Hot Beverages"],
        image: "uploads/matcha-latte.jpg",
      },

      // Cold Beverages
      {
        name: "Iced Tea",
        description: "Refreshing black tea served over ice with lemon",
        price: 2.95,
        category: categoryMap["Cold Beverages"],
        image: "uploads/iced-tea.jpg",
      },
      {
        name: "Lemonade",
        description: "Fresh squeezed lemons with a touch of sweetness",
        price: 3.25,
        category: categoryMap["Cold Beverages"],
        image: "uploads/lemonade.jpg",
      },
      {
        name: "Fruit Smoothie",
        description: "Blended seasonal fruits with yogurt and honey",
        price: 5.25,
        category: categoryMap["Cold Beverages"],
        image: "uploads/fruit-smoothie.jpg",
      },
      {
        name: "Sparkling Water",
        description: "Refreshing sparkling water with your choice of flavor",
        price: 2.25,
        category: categoryMap["Cold Beverages"],
        image: "uploads/sparkling-water.jpg",
      },
      {
        name: "Fresh Orange Juice",
        description: "100% fresh squeezed orange juice",
        price: 4.5,
        category: categoryMap["Cold Beverages"],
        image: "uploads/orange-juice.jpg",
      },

      // Pastries & Desserts
      {
        name: "Croissant",
        description: "Buttery, flaky French pastry baked fresh daily",
        price: 2.95,
        category: categoryMap["Pastries & Desserts"],
        image: "uploads/croissant.jpg",
      },
      {
        name: "Chocolate Chip Muffin",
        description: "Moist muffin loaded with chocolate chips",
        price: 3.25,
        category: categoryMap["Pastries & Desserts"],
        image: "uploads/chocolate-chip-muffin.jpg",
      },
      {
        name: "Blueberry Scone",
        description: "Traditional English scone with fresh blueberries",
        price: 3.5,
        category: categoryMap["Pastries & Desserts"],
        image: "uploads/blueberry-scone.jpg",
      },
      {
        name: "Tiramisu",
        description: "Classic Italian dessert with coffee-soaked ladyfingers",
        price: 5.95,
        category: categoryMap["Pastries & Desserts"],
        image: "uploads/tiramisu.jpg",
      },
      {
        name: "Cheesecake Slice",
        description: "Rich New York style cheesecake with berry compote",
        price: 4.75,
        category: categoryMap["Pastries & Desserts"],
        image: "uploads/cheesecake.jpg",
      },
      {
        name: "Danish Pastry",
        description: "Flaky pastry with seasonal fruit or cream cheese filling",
        price: 3.75,
        category: categoryMap["Pastries & Desserts"],
        image: "uploads/danish-pastry.jpg",
      },

      // Sandwiches & Wraps
      {
        name: "Club Sandwich",
        description:
          "Turkey, bacon, lettuce, tomato, and mayo on toasted bread",
        price: 8.95,
        category: categoryMap["Sandwiches & Wraps"],
        image: "uploads/club-sandwich.jpg",
      },
      {
        name: "Grilled Cheese",
        description: "Melted cheese on buttery grilled sourdough bread",
        price: 6.5,
        category: categoryMap["Sandwiches & Wraps"],
        image: "uploads/grilled-cheese.jpg",
      },
      {
        name: "Chicken Caesar Wrap",
        description:
          "Grilled chicken, romaine lettuce, parmesan, and caesar dressing",
        price: 7.95,
        category: categoryMap["Sandwiches & Wraps"],
        image: "uploads/chicken-caesar-wrap.jpg",
      },
      {
        name: "Veggie Panini",
        description: "Grilled vegetables with pesto and mozzarella on ciabatta",
        price: 7.25,
        category: categoryMap["Sandwiches & Wraps"],
        image: "uploads/veggie-panini.jpg",
      },
      {
        name: "BLT Sandwich",
        description: "Crispy bacon, lettuce, and tomato on toasted bread",
        price: 7.5,
        category: categoryMap["Sandwiches & Wraps"],
        image: "uploads/blt-sandwich.jpg",
      },

      // Breakfast
      {
        name: "Avocado Toast",
        description:
          "Smashed avocado on multigrain toast with everything seasoning",
        price: 6.95,
        category: categoryMap["Breakfast"],
        image: "uploads/avocado-toast.jpg",
      },
      {
        name: "Breakfast Burrito",
        description:
          "Scrambled errors, cheese, potatoes, and your choice of meat",
        price: 8.5,
        category: categoryMap["Breakfast"],
        image: "uploads/breakfast-burrito.jpg",
      },
      {
        name: "Pancakes",
        description: "Fluffy buttermilk pancakes served with maple syrup",
        price: 7.95,
        category: categoryMap["Breakfast"],
        image: "uploads/pancakes.jpg",
      },
      {
        name: "Eggs Benedict",
        description: "Poached eggs and ham on English muffin with hollandaise",
        price: 9.95,
        category: categoryMap["Breakfast"],
        image: "uploads/eggs-benedict.jpg",
      },
      {
        name: "Granola Bowl",
        description: "House-made granola with yogurt and fresh berries",
        price: 6.5,
        category: categoryMap["Breakfast"],
        image: "uploads/granola-bowl.jpg",
      },

      // Light Meals
      {
        name: "Caesar Salad",
        description: "Romaine lettuce, croutons, parmesan with caesar dressing",
        price: 7.95,
        category: categoryMap["Light Meals"],
        image: "uploads/caesar-salad.jpg",
      },
      {
        name: "Quinoa Bowl",
        description:
          "Quinoa with roasted vegetables, avocado, and tahini dressing",
        price: 9.25,
        category: categoryMap["Light Meals"],
        image: "uploads/quinoa-bowl.jpg",
      },
      {
        name: "Soup of the Day",
        description: "Chef's daily selection served with artisan bread",
        price: 5.95,
        category: categoryMap["Light Meals"],
        image: "uploads/soup.jpg",
      },
      {
        name: "Acai Bowl",
        description: "Acai smoothie topped with granola, banana, and berries",
        price: 8.95,
        category: categoryMap["Light Meals"],
        image: "uploads/acai-bowl.jpg",
      },

      // Snacks
      {
        name: "Bagel with Cream Cheese",
        description: "Fresh baked bagel with choice of cream cheese",
        price: 3.95,
        category: categoryMap["Snacks"],
        image: "uploads/bagel-cream-cheese.jpg",
      },
      {
        name: "Hummus & Pita",
        description: "House-made hummus served with warm pita bread",
        price: 4.5,
        category: categoryMap["Snacks"],
        image: "uploads/hummus-pita.jpg",
      },
      {
        name: "Mixed Nuts",
        description: "Premium roasted mixed nuts with sea salt",
        price: 3.25,
        category: categoryMap["Snacks"],
        image: "uploads/mixed-nuts.jpg",
      },
      {
        name: "Energy Bar",
        description: "House-made energy bar with dates, nuts, and seeds",
        price: 2.95,
        category: categoryMap["Snacks"],
        image: "uploads/energy-bar.jpg",
      },
      {
        name: "Chips & Salsa",
        description: "Crispy tortilla chips with fresh house-made salsa",
        price: 4.25,
        category: categoryMap["Snacks"],
        image: "uploads/chips-salsa.jpg",
      },
    ];

    console.log("\n🍽️  Creating Menu Items...");
    console.log("-".repeat(50));

    // Create menu items one by one with detailed logging
    const createdMenuItems = [];
    let currentCategory = "";

    for (let i = 0; i < menuItemsData.length; i++) {
      const itemData = menuItemsData[i];

      // Find category name for logging
      const categoryName = Object.keys(categoryMap).find((key) =>
        categoryMap[key].equals(itemData.category)
      );

      // Print category header when we switch categories
      if (categoryName !== currentCategory) {
        currentCategory = categoryName;
        console.log(`\n📂 ${currentCategory.toUpperCase()}:`);
        console.log("   " + "-".repeat(categoryName.length + 2));
      }

      try {
        const newMenuItem = new MenuItem(itemData);
        const savedMenuItem = await newMenuItem.save();
        createdMenuItems.push(savedMenuItem);

        console.log(
          `   ✅ ${i + 1}/${menuItemsData.length}: "${savedMenuItem.name}" - $${
            savedMenuItem.price
          } (ID: ${savedMenuItem._id})`
        );
      } catch (error) {
        console.error(
          `   ❌ Error creating item "${itemData.name}":`,
          error.message
        );
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("🎉 SEEDER COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(50));
    console.log(`📊 Summary:`);
    console.log(
      `   • Categories created: ${createdCategories.length}/${categoriesData.length}`
    );
    console.log(
      `   • Menu items created: ${createdMenuItems.length}/${menuItemsData.length}`
    );
    console.log(
      `   • Total items in database: ${
        createdCategories.length + createdMenuItems.length
      }`
    );
    console.log("=".repeat(50));
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

    await createCategoriesAndMenuItems();
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
