import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import PageLoader from "../components/PageLoader";
import ErrorBoundary from "../components/ErrorBoundary";

// Customer Pages - Lazy Loaded
const Home = lazy(() => import("../pages/Home"));
const Searchpage = lazy(() => import("../pages/Searchpage"));
const AllCategories = lazy(() => import("../pages/AllCategories"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const OtpVerification = lazy(() => import("../pages/OtpVerification"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const UerMenuMobile = lazy(() => import("../pages/UerMenuMobile"));
const ProductListPage = lazy(() => import("../pages/ProductListPage"));
const ProductDisplaypage = lazy(() => import("../pages/ProductDisplaypage"));
const CartMobile = lazy(() => import("../components/CartMobile"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const SuccessPage = lazy(() => import("../pages/SuccessPage"));
const Cancel = lazy(() => import("../pages/Cancel"));

// Dashboard & User Account Pages - Lazy Loaded
const Dashboard = lazy(() => import("../layouts/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const MyOrders = lazy(() => import("../pages/MyOrders"));
const Addresses = lazy(() => import("../pages/Addresses"));
const EGiftCards = lazy(() => import("../pages/EGiftCards"));
const Faqs = lazy(() => import("../pages/Faqs"));
const AccountPrivacy = lazy(() => import("../pages/AccountPrivacy"));
const MyGroceryPlans = lazy(() => import("../pages/MyGroceryPlans"));

// Admin Protected Layout & Pages - Lazy Loaded (Isolated from public bundle)
const AdminPermission = lazy(() => import("../layouts/AdminPermission"));
const Category = lazy(() => import("../pages/Category"));
const SubCategory = lazy(() => import("../pages/SubCategory"));
const UploadProduct = lazy(() => import("../pages/UploadProduct"));
const ProductsAdmin = lazy(() => import("../pages/ProductsAdmin"));
const RecipesAdmin = lazy(() => import("../pages/RecipesAdmin"));
const GiftCardAdmin = lazy(() => import("../pages/GiftCardAdmin"));
const OrdersAdmin = lazy(() => import("../pages/OrdersAdmin"));
const GroceryPlannerAdmin = lazy(() => import("../pages/GroceryPlannerAdmin"));

// Helper to wrap lazy components in Suspense + ErrorBoundary
const withSuspense = (Component, loaderMessage) => (
  <ErrorBoundary>
    <Suspense fallback={<PageLoader message={loaderMessage} />}>
      {Component}
    </Suspense>
  </ErrorBoundary>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: (
      <ErrorBoundary>
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold">Page Not Found or Navigation Error</h2>
          <a href="/" className="text-green-700 underline mt-4 inline-block">Return to Homepage</a>
        </div>
      </ErrorBoundary>
    ),
    children: [
      {
        path: "/",
        element: withSuspense(<Home />, "Loading Fresh Groceries...")
      },
      {
        path: "search",
        element: withSuspense(<Searchpage />, "Searching Products...")
      },
      {
        path: "all-categories",
        element: withSuspense(<AllCategories />, "Loading Categories...")
      },
      {
        path: "login",
        element: withSuspense(<Login />, "Opening Secure Login...")
      },
      {
        path: "register",
        element: withSuspense(<Register />, "Opening Registration...")
      },
      {
        path: "forgot-password",
        element: withSuspense(<ForgotPassword />, "Password Recovery...")
      },
      {
        path: "verification-otp",
        element: withSuspense(<OtpVerification />, "Verifying Security OTP...")
      },
      {
        path: "reset-password",
        element: withSuspense(<ResetPassword />, "Resetting Password...")
      },
      {
        path: "user",
        element: withSuspense(<UerMenuMobile />, "Loading User Menu...")
      },
      {
        path: "dashboard",
        element: withSuspense(<Dashboard />, "Loading Dashboard..."),
        children: [
          {
            path: "profile",
            element: withSuspense(<Profile />, "Loading Profile...")
          },
          {
            path: "my-orders",
            element: withSuspense(<MyOrders />, "Fetching Your Orders...")
          },
          {
            path: "address",
            element: withSuspense(<Addresses />, "Loading Addresses...")
          },
          {
            path: "e-gift-cards",
            element: withSuspense(<EGiftCards />, "Loading Gift Cards...")
          },
          {
            path: "faqs",
            element: withSuspense(<Faqs />, "Loading FAQs...")
          },
          {
            path: "accountprivacy",
            element: withSuspense(<AccountPrivacy />, "Loading Privacy Settings...")
          },
          {
            path: "my-grocery-plans",
            element: withSuspense(<MyGroceryPlans />, "Loading Saved Meal Plans...")
          },
          // Admin Protected Routes
          {
            path: "category",
            element: withSuspense(
              <AdminPermission>
                <Category />
              </AdminPermission>,
              "Loading Category Management..."
            )
          },
          {
            path: "subcategory",
            element: withSuspense(
              <AdminPermission>
                <SubCategory />
              </AdminPermission>,
              "Loading Subcategories..."
            )
          },
          {
            path: "uploadproduct",
            element: withSuspense(
              <AdminPermission>
                <UploadProduct />
              </AdminPermission>,
              "Opening Product Uploader..."
            )
          },
          {
            path: "products",
            element: withSuspense(
              <AdminPermission>
                <ProductsAdmin />
              </AdminPermission>,
              "Loading Product Inventory..."
            )
          },
          {
            path: "recipes",
            element: withSuspense(
              <AdminPermission>
                <RecipesAdmin />
              </AdminPermission>,
              "Loading Recipe Management..."
            )
          },
          {
            path: "manage-gift-cards",
            element: withSuspense(
              <AdminPermission>
                <GiftCardAdmin />
              </AdminPermission>,
              "Loading Gift Card Admin..."
            )
          },
          {
            path: "admin-orders",
            element: withSuspense(
              <AdminPermission>
                <OrdersAdmin />
              </AdminPermission>,
              "Loading Admin Order List..."
            )
          },
          {
            path: "grocery-planner-admin",
            element: withSuspense(
              <AdminPermission>
                <GroceryPlannerAdmin />
              </AdminPermission>,
              "Loading AI Planner Management..."
            )
          }
        ]
      },
      {
        path: ":category",
        children: [
          {
            path: "",
            element: withSuspense(<ProductListPage />, "Loading Products...")
          },
          {
            path: ":subCategory",
            element: withSuspense(<ProductListPage />, "Loading Products...")
          }
        ]
      },
      {
        path: "product/:product",
        element: withSuspense(<ProductDisplaypage />, "Loading Product Details...")
      },
      {
        path: "cart",
        element: withSuspense(<CartMobile />, "Opening Cart...")
      },
      {
        path: "checkout",
        element: withSuspense(<CheckoutPage />, "Preparing Secure Checkout...")
      },
      {
        path: "success",
        element: withSuspense(<SuccessPage />, "Order Completed...")
      },
      {
        path: "cancel",
        element: withSuspense(<Cancel />, "Order Cancelled...")
      }
    ]
  }
]);

export default router;