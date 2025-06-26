import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Tab, Tabs, Box } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { fetchMenuItems } from "../redux/menuSlice";
import { fetchCategories } from "../redux/categorySlice";
import { fetchResources } from "../redux/resourceSlice";
import Backdrop from "../components/Backdrop";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ErrorBoundary from "../components/ErrorBoundary";
import MenuItemsTable from "../components/MenuItemsTable";
import CategoriesTable from "../components/CategoriesTable";
import ResourcesTable from "../components/ResourcesTable";

const MenuManagement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const menuItemsTableRef = useRef();
  const categoriesTableRef = useRef();
  const resourcesTableRef = useRef();

  const { menuItems } = useSelector((state) => state.menu);
  const { categories } = useSelector((state) => state.category);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (
      !userInfo ||
      (userInfo.role !== "Admin" && userInfo.role !== "Barista")
    ) {
      navigate("/");
      return;
    }

    setIsLoading(true);
    try {
      dispatch(fetchMenuItems());
      dispatch(fetchCategories());
      dispatch(fetchResources());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, navigate, userInfo]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getAddButtonText = () => {
    switch (tabValue) {
      case 0:
        return t("add_menu_item");
      case 1:
        return t("add_category");
      case 2:
        return t("add_resource");
      default:
        return t("add");
    }
  };

  const handleAddClick = () => {
    switch (tabValue) {
      case 0:
        if (menuItemsTableRef.current) {
          menuItemsTableRef.current.openAddModal();
        }
        break;
      case 1:
        if (categoriesTableRef.current) {
          categoriesTableRef.current.openAddModal();
        }
        break;
      case 2:
        if (resourcesTableRef.current) {
          resourcesTableRef.current.openAddModal();
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        title={t("menu_management_title")}
        subtitle={t("menu_management_subtitle")}
      />

      <Backdrop isOpen={isLoading} />

      <div className="flex-grow container mx-auto px-4 mt-8 mb-8">
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              "& .MuiTab-root": { color: "#DA9F5B" },
              "& .Mui-selected": {
                color: "#33211D !important",
                fontWeight: "bold",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#DA9F5B",
              },
            }}
          >
            <Tab label={t("menu_items")} />
            <Tab label={t("categories")} />
            <Tab label={t("storage")} />
          </Tabs>
        </Box>

        {/* Add Button */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{
            mb: 3,
            backgroundColor: "#DA9F5B",
            "&:hover": { backgroundColor: "#c48f51" },
          }}
        >
          {getAddButtonText()}
        </Button>

        {/* Tab Content */}
        {tabValue === 0 && (
          <ErrorBoundary>
            <MenuItemsTable
              ref={menuItemsTableRef}
              menuItems={menuItems || []}
              categories={categories || []}
              setIsLoading={setIsLoading}
            />
          </ErrorBoundary>
        )}

        {tabValue === 1 && (
          <ErrorBoundary>
            <CategoriesTable
              ref={categoriesTableRef}
              categories={categories || []}
              setIsLoading={setIsLoading}
            />
          </ErrorBoundary>
        )}

        {tabValue === 2 && (
          <ErrorBoundary>
            <ResourcesTable
              ref={resourcesTableRef}
              categories={categories || []}
              setIsLoading={setIsLoading}
            />
          </ErrorBoundary>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MenuManagement;
