import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Searchpage from "../pages/Searchpage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import UerMenuMobile from "../pages/UerMenuMobile";
import Dashboard from "../layouts/Dashboard"
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import Addresses from "../pages/Addresses";
import EGiftCards from "../pages/EGiftCards";
import Fags from "../pages/Fags";
import AccountPrivacy from "../pages/AccountPrivacy";
import Category from "../pages/Category";
import Subcategory from "../pages/Subcategory";
import UploadProduct from "../pages/UploadProduct";
import ProductsAdmin from "../pages/ProductsAdmin";
import AdminPermission from "../layouts/AdminPermission";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplaypage from "../pages/ProductDisplaypage";
import CartMobile from "../components/CartMobile";
import CheckoutPage from "../pages/CheckoutPage";
import SuccessPage from "../pages/SuccessPage";
import Cancel from "../pages/Cancel";


const router =createBrowserRouter([ 
    {
          path: "/",
          element:<App/>,

          children:[
            {
                path :"/",
                element : <Home/>   
            },
            {
              path :"search",
              element :<Searchpage/>
          },
          {
           path:"login",
           element:<Login/>
          },
          {
            path:"register",
            element:<Register/>
          },
          {
            path:"forgot-password",
            element:<ForgotPassword/>
          },
          {
           path:"verification-otp",
           element:<OtpVerification/>
          },{
            path:"reset-password",
            element:<ResetPassword/>
          },
          {
            path:"user",
            element:<UerMenuMobile/>
          },
          {
            path:"dashboard",
            element:<Dashboard/>,
            children:[
              {
                path:"profile",
                element:<Profile/>
              },
              {
                path:"my-orders",
                element:<MyOrders/>
              },
              {
                path:"address",
                element:<Addresses/>
              },
              {
                path:"e-gift-cards",
                element:<EGiftCards/>
              },
              {
                path:"faqs",
                element:<Fags/>
              },
              {
                path:"accountprivacy",
                element:<AccountPrivacy/>
              },
              {
                path:"category",
                element:<AdminPermission><Category/></AdminPermission>
              },
              {
                path:"subcategory",
                element:<AdminPermission><Subcategory/></AdminPermission>
              },
              {
                path:"uploadproduct",
                element: <AdminPermission><UploadProduct/></AdminPermission>

              },
              {
                path:"products",
                element:<AdminPermission><ProductsAdmin/></AdminPermission>
              }

            ]
          },
          {
            path:":category",
            children:[
              {
                path:":subCategory",
                element:<ProductListPage/>
              }
            ]
          },{
            path:"product/:product",
            element:<ProductDisplaypage/>
          },{
            path:"cart",
            element:<CartMobile/>
          },{
            path:"checkout",
            element:<CheckoutPage/>
          },{
            path:"success",
            element:<SuccessPage/>
          },{
            path:"/cancel",
            element:<Cancel/>
          }

          
          
           
          ]
    }
])

export default router