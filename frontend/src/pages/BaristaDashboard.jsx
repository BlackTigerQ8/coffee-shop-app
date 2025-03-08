import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Paper,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  LocalCafe as LocalCafeIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Payment as PaymentIcon,
  MonetizationOn as MonetizationOnIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";

const OrderStatus = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

const PaymentStatus = {
  PENDING: "pending",
  PAID: "paid",
  REFUNDED: "refunded",
};

const PaymentMethod = {
  CASH: "cash",
  CARD: "card",
  MOBILE: "mobile",
};

const mockOrders = [
  {
    id: 1,
    customerName: "John Doe",
    items: [{ name: "Coffee", price: 2.5, quantity: 2 }],
    total: 5,
    status: OrderStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
    timestamp: "2024-01-01T12:00:00Z",
    notes: "Notes for this order",
  },
  {
    id: 2,
    customerName: "Jane Smith",
    items: [{ name: "Tea", price: 3, quantity: 1 }],
    total: 3,
    status: OrderStatus.IN_PROGRESS,
    paymentStatus: PaymentStatus.PENDING,
    timestamp: "2024-01-01T12:01:00Z",
    notes: "Notes for this order",
  },
  {
    id: 3,
    customerName: "Alice Johnson",
    items: [{ name: "Sandwich", price: 4.5, quantity: 1 }],
    total: 4.5,
    status: OrderStatus.COMPLETED,
    paymentStatus: PaymentStatus.PAID,
    timestamp: "2024-01-01T12:02:00Z",
    notes: "Notes for this order",
  },
];

const StyledTab = ({ label, count }) => (
  <div className="flex flex-col items-center px-2 py-1">
    <span className="text-sm sm:text-base whitespace-nowrap">{label}</span>
    {count !== undefined && (
      <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full mt-1">
        {count}
      </span>
    )}
  </div>
);

const BaristaDashboard = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState(mockOrders);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedStatus, setEditedStatus] = useState("");
  const [editedNotes, setEditedNotes] = useState("");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [amountReceived, setAmountReceived] = useState("");
  const [change, setChange] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.CASH);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [dailyTransactions, setDailyTransactions] = useState(0);

  // Add the missing containerVariants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "warning";
      case OrderStatus.IN_PROGRESS:
        return "info";
      case OrderStatus.COMPLETED:
        return "success";
      case OrderStatus.CANCELLED:
        return "error";
      default:
        return "default";
    }
  };

  const getFilteredOrders = () => {
    return orders.filter((order) => {
      switch (activeTab) {
        case 0: // All orders
          return true;
        case 1: // Active orders
          return [OrderStatus.PENDING, OrderStatus.IN_PROGRESS].includes(
            order.status
          );
        case 2: // Completed orders
          return order.status === OrderStatus.COMPLETED;
        default:
          return true;
      }
    });
  };

  const getOrdersCount = (status) => {
    if (status === "active") {
      return orders.filter((order) =>
        [OrderStatus.PENDING, OrderStatus.IN_PROGRESS].includes(order.status)
      ).length;
    }
    if (status === "completed") {
      return orders.filter((order) => order.status === OrderStatus.COMPLETED)
        .length;
    }
    return orders.length;
  };

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setEditedStatus(order.status);
    setEditedNotes(order.notes || "");
    setIsEditDialogOpen(true);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Replace with actual API call
        const response = await fetch("/api/orders");
        const data = await response.json();
        setOrders(data);
        calculateDailyStats(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const calculateDailyStats = (orderData) => {
    const today = new Date().toDateString();
    const todayOrders = orderData.filter(
      (order) => new Date(order.timestamp).toDateString() === today
    );

    const total = todayOrders.reduce(
      (sum, order) =>
        sum + (order.paymentStatus === PaymentStatus.PAID ? order.total : 0),
      0
    );

    setDailyTotal(total);
    setDailyTransactions(
      todayOrders.filter((order) => order.paymentStatus === PaymentStatus.PAID)
        .length
    );
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handlePayment = async () => {
    try {
      if (!selectedOrder) return;

      // Replace with actual API call
      const response = await fetch(`/api/orders/${selectedOrder.id}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: paymentMethod,
          amountReceived: parseFloat(amountReceived),
          change: change,
        }),
      });

      if (!response.ok) throw new Error("Failed to process payment");

      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, paymentStatus: PaymentStatus.PAID, paymentMethod }
            : order
        )
      );

      // Update daily stats
      setDailyTotal((prev) => prev + selectedOrder.total);
      setDailyTransactions((prev) => prev + 1);

      setShowPaymentDialog(false);
    } catch (error) {
      console.error("Failed to process payment:", error);
    }
  };

  const calculateChange = (received) => {
    const amount = parseFloat(received);
    if (!isNaN(amount) && selectedOrder) {
      setAmountReceived(received);
      setChange(amount - selectedOrder.total);
    }
  };

  const renderOrderCard = (order) => (
    <Paper
      key={order.id}
      elevation={0}
      className="p-4 border border-gray-200 rounded-lg"
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <div className="flex justify-between items-start">
            <div>
              <Typography variant="h6" className="text-secondary">
                #{order.id} - {order.customerName}
              </Typography>
              <div className="flex flex-col sm:flex-row gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Typography variant="caption" className="text-gray-600">
                    {t("order_status")}:
                  </Typography>
                  <Chip
                    label={t(order.status)}
                    color={getStatusChipColor(order.status)}
                    size="small"
                    sx={{
                      "& .MuiChip-label": {
                        px: 1,
                      },
                    }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Typography variant="caption" className="text-gray-600">
                    {t("payment_status")}:
                  </Typography>
                  <Chip
                    label={t(order.paymentStatus)}
                    color={
                      order.paymentStatus === PaymentStatus.PAID
                        ? "success"
                        : "warning"
                    }
                    size="small"
                    sx={{
                      "& .MuiChip-label": {
                        px: 1,
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            <IconButton
              size="small"
              onClick={() => handleEditClick(order)}
              sx={{ color: "#DA9F5B" }}
            >
              <EditIcon />
            </IconButton>
          </div>

          <div className="mt-4 space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <Divider />
            <div className="flex justify-between font-bold">
              <span>{t("total")}</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </Grid>

        <Grid item xs={12} sm={4}>
          <div className="flex flex-col h-full justify-between">
            <div>
              {order.notes && (
                <Typography variant="body2" className="text-gray-600">
                  <strong>{t("notes")}:</strong> {order.notes}
                </Typography>
              )}
              <div className="flex items-center mt-2 text-gray-600">
                <AccessTimeIcon fontSize="small" className="mr-1" />
                <Typography variant="body2">
                  {new Date(order.timestamp).toLocaleTimeString()}
                </Typography>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              {order.status === OrderStatus.PENDING && (
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<LocalCafeIcon />}
                  onClick={() =>
                    handleStatusChange(order.id, OrderStatus.IN_PROGRESS)
                  }
                  sx={{
                    backgroundColor: "#DA9F5B",
                    "&:hover": { backgroundColor: "#c48f51" },
                  }}
                >
                  {t("start_preparing")}
                </Button>
              )}

              {order.status === OrderStatus.IN_PROGRESS && (
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  onClick={() =>
                    handleStatusChange(order.id, OrderStatus.COMPLETED)
                  }
                >
                  {t("mark_completed")}
                </Button>
              )}

              {order.paymentStatus === PaymentStatus.PENDING && (
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PaymentIcon />}
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowPaymentDialog(true);
                  }}
                  sx={{
                    borderColor: "#DA9F5B",
                    color: "#DA9F5B",
                    "&:hover": {
                      borderColor: "#c48f51",
                      backgroundColor: "rgba(218, 159, 91, 0.04)",
                    },
                  }}
                >
                  {t("collect_payment")}
                </Button>
              )}
            </div>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <div ref={ref} className="flex flex-col min-h-screen">
      <Header
        title={t("barista_dashboard_title")}
        subtitle={t("barista_dashboard_subtitle")}
      />

      <motion.div
        className="flex-grow container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Daily Statistics */}
        <Paper elevation={0} className="p-4 mb-6">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" className="text-secondary">
                {t("daily_total")}
              </Typography>
              <Typography variant="h4" className="text-primary">
                ${dailyTotal.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" className="text-secondary">
                {t("transactions")}
              </Typography>
              <Typography variant="h4" className="text-primary">
                {dailyTransactions}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Orders List */}
        <Paper elevation={0} className="p-6 rounded-lg">
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            // centered={true}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              mb: 4,
              minHeight: { xs: "72px", sm: "48px" },
              "& .MuiTabs-flexContainer": {
                gap: { xs: 1, sm: 2 },
              },
              "& .MuiTab-root": {
                color: "#656565",
                minHeight: { xs: "72px", sm: "48px" },
                padding: { xs: "12px 16px", sm: "12px 24px" },
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
              "& .Mui-selected": {
                color: "#DA9F5B !important",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#DA9F5B",
              },
              "& .MuiTabScrollButton-root": {
                color: "#DA9F5B",
              },
            }}
          >
            <Tab
              label={
                <StyledTab
                  label={t("all_orders")}
                  count={getOrdersCount("all")}
                />
              }
            />
            <Tab
              label={
                <StyledTab
                  label={t("active_orders")}
                  count={getOrdersCount("active")}
                />
              }
            />
            <Tab
              label={
                <StyledTab
                  label={t("completed_orders")}
                  count={getOrdersCount("completed")}
                />
              }
            />
          </Tabs>

          <div className="space-y-4">
            {getFilteredOrders().map(renderOrderCard)}
          </div>
        </Paper>
      </motion.div>

      {/* Payment Dialog */}
      <Dialog
        open={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {t("collect_payment")} - #{selectedOrder?.id}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-2">
            <Typography variant="h5" className="font-bold">
              {t("total_amount")}: ${selectedOrder?.total.toFixed(2)}
            </Typography>

            <FormControl fullWidth>
              <InputLabel>{t("payment_method")}</InputLabel>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                label={t("payment_method")}
              >
                {Object.entries(PaymentMethod).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {t(value)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {paymentMethod === PaymentMethod.CASH && (
              <>
                <TextField
                  fullWidth
                  label={t("amount_received")}
                  type="number"
                  value={amountReceived}
                  onChange={(e) => calculateChange(e.target.value)}
                  InputProps={{
                    startAdornment: <MonetizationOnIcon className="mr-2" />,
                  }}
                />
                {change >= 0 && amountReceived && (
                  <Typography
                    variant="h6"
                    className={change >= 0 ? "text-green-600" : "text-red-600"}
                  >
                    {t("change")}: ${Math.max(0, change).toFixed(2)}
                  </Typography>
                )}
              </>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPaymentDialog(false)}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handlePayment}
            disabled={
              paymentMethod === PaymentMethod.CASH &&
              (parseFloat(amountReceived) < (selectedOrder?.total || 0) ||
                !amountReceived)
            }
            sx={{
              color: "#DA9F5B",
              "&:hover": { backgroundColor: "rgba(218, 159, 91, 0.04)" },
            }}
          >
            {t("confirm_payment")}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default BaristaDashboard;
