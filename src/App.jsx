import React, { useEffect, Suspense, lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Header from "./Component/Home/header";
import Footer from "./Component/Home/footer";
import Booking from "./Pages/booking";
import AdminHeader from "./Pages/Admin/adminheader";
import BaseUrl from "./Api/baseurl";
import AddAppointment from "./Pages/Admin/AddDetails/addappointments";
import EditAppointment from "./Pages/Admin/EditPages/editappointment";
// import ManageSlots from "./Pages/Admin/manageslots";
import ProtectedRoute from "./Component/ProtectedRoute";
import PatientProtectedRoute from "./Component/Auth/PatientProtectedRoute";
import LoaderH from "./Component/Loader/loader";
import Home from "./Pages/home";
import Userdashboard from "./Pages/User/userdashboard";

const ManageSlots = lazy(() => import("./Pages/Admin/manageslots"));
const ManageRoles = lazy(() => import("./Pages/Admin/ManageRoles/manageroles"));
const Authenticate = lazy(() =>
  import("./Component/Authenticate/authenticate")
);
const Profile = lazy(() => import("./Pages/User/userprofile"));
const EditUserProfile = lazy(() => import("./Pages/User/edituserprofile"));
const UserAppointments = lazy(() => import("./Pages/User/userappointments"));
const UserDocuments = lazy(() => import("./Pages/User/userdocuments"));
const UserMessages = lazy(() => import("./Pages/User/usermessages"));
const PasswordChange = lazy(() => import("./Pages/User/passwordchange"));
const About = lazy(() => import("./Pages/about"));
const Hospitals = lazy(() => import("./Pages/hospitals"));
const HospitalProfile = lazy(() => import("./Pages/hospitalprofile"));
const DoctorListing = lazy(() => import("./Pages/doctorlisting"))
const GetDetails = lazy(() => import("./Pages/getdetails"));
const ContactUs = lazy(() => import("./Pages/contactus"));
const Services = lazy(() => import("./Pages/services"));
const PaymentPage = lazy(() => import("./Pages/payment"))
const Blog = lazy(() => import("./Pages/blog"));
const BlogPage = lazy(() => import("./Component/Blog/blogpage"));
const DoctorProfile = lazy(() => import("./Pages/doctorprofile"));
const PrivacyPolicy = lazy(() => import("./Pages/privacypolicy"));
const TermsofService = lazy(() => import("./Pages/termsofservice"));
const AdminLogin = lazy(() => import("./Pages/Admin/adminlogin"));
const DoctorLogin = lazy(() => import("./Pages/Doctor/doctorlogin"));
const DashBoard = lazy(() => import("./Pages/Admin/dashboard"));
const Appointments = lazy(() => import("./Pages/Admin/appointments"));
const MyProfile = lazy(() => import("./Pages/Admin/myprofile"));
const EditProfile = lazy(() => import("./Pages/Admin/EditPages/editprofile"));
const PatientDetails = lazy(() =>
  import("./Pages/Admin/PatientDetails/patientdetails")
);
const ChangePassword = lazy(() => import("./Pages/Admin/changepassword"));
const Notification = lazy(() => import("./Pages/Admin/notification"));
const LogoChange = lazy(() =>
  import("./Pages/Admin/Configurations/logochange")
);
const CurrencySettings = lazy(() =>
  import("./Pages/Admin/Configurations/currency")
);
const FaviconChange = lazy(() =>
  import("./Pages/Admin/Configurations/faviconchange")
);
const SocialMediaProfiles = lazy(() =>
  import("./Pages/Admin/Configurations/socialmediaprofiles")
);
const Timings = lazy(() => import("./Pages/Admin/Configurations/timings"));
const SloganText = lazy(() =>
  import("./Pages/Admin/Configurations/slogantext")
);
const Address = lazy(() => import("./Pages/Admin/Configurations/address"));
const ManagePatients = lazy(() => import("./Pages/Admin/managepatients"));
const ManageVendor = lazy(() => import("./Pages/Admin/managevendor"));
const Staff = lazy(() => import("./Pages/Admin/staff"));
const AddVendor = lazy(() => import("./Pages/Admin/AddDetails/addvendor"));
const AddStaff = lazy(() => import("./Pages/Admin/AddDetails/addstaff"));
const AddPatient = lazy(() => import("./Pages/Admin/AddDetails/addpatient"));
const EditStaff = lazy(() => import("./Pages/Admin/EditPages/editstaff"));
const EditPatient = lazy(() => import("./Pages/Admin/EditPages/editpatient"));
const ConsultationQuery = lazy(() => import("./Pages/Admin/consultationquery"));
const ManageContent = lazy(() => import("./Pages/Admin/managecontent"));
const EditContent = lazy(() => import("./Pages/Admin/EditPages/editcontent"));
const Blogs = lazy(() => import("./Pages/Admin/blogs"));
const EditVendor = lazy(() => import("./Pages/Admin/EditPages/editvendor"));
const EditBlog = lazy(() => import("./Pages/Admin/EditPages/editblog"));
const EditBlogCategory = lazy(() =>
  import("./Pages/Admin/EditPages/editblogcategory")
);
const AddBlog = lazy(() => import("./Pages/Admin/AddDetails/addblogs"));
const AddBlogCategory = lazy(() =>
  import("./Pages/Admin/AddDetails/addblogcategory")
);
const AdminServices = lazy(() => import("./Pages/Admin/adminservices"));
const AddService = lazy(() => import("./Pages/Admin/AddDetails/addservices"));
const EditService = lazy(() => import("./Pages/Admin/EditPages/editservices"));
const ManageDepartment = lazy(() => import("./Pages/Admin/managedepartment"));
const EditDepartment = lazy(() =>
  import("./Pages/Admin/EditPages/editdepartment")
);
const AddDepartment = lazy(() =>
  import("./Pages/Admin/AddDetails/adddepartment")
);
const ManageBlogCategories = lazy(() =>
  import("./Pages/Admin/manageblogcategories")
);
const ManageLocation = lazy(() => import("./Pages/Admin/managelocations"));
const AddLocation = lazy(() => import("./Pages/Admin/AddDetails/addlocation"));
const EditLocation = lazy(() => import("./Pages/Admin/EditPages/editlocation"));
const ManageContact = lazy(() => import("./Pages/Admin/managecontact"));
const ManageFeedback = lazy(() => import("./Pages/Admin/managefeedback"));
const SlotSettings = lazy(() => import("./Pages/Admin/EditPages/slotsettings"));
const ManageHolidays = lazy(() => import("./Pages/Admin/manageholidays"));
const Messages = lazy(() => import("./Pages/Admin/messages"));
const Inventory = lazy(() => import("./Pages/Admin/inventory"));
const HospitalManager = lazy(() => import("./Pages/Admin/hospitalmanager"));
const HospitalTests = lazy(() => import("./Pages/Admin/hospitaltests"));
const UserLogin = lazy(() => import("./Pages/User/userlogin"));
const UserRegister = lazy(() => import("./Pages/User/userregister"));
const VendorLogin = lazy(() => import("./Pages/Vendor/vendorlogin"));
const SetupNotification = lazy(() =>
  import("./Pages/Admin/SetUpNotifications")
);

const toPublicRoute = (path) => {
  const base = process.env.PUBLIC_URL || "";
  return `${base}${path}` || path;
};

const App = () => {
  const location = useLocation();
  useEffect(() => {
    const url = window.location.href;

    if (url.includes("/authenticate/user")) {
      const username = url.split("/authenticate/user/")[1];
      
      handleMailURL(username);
    }
  }, []);

  const handleMailURL = async (username) => {
    let url = `clinic/patient-activation/${username}/`;
    try {
      const response = await axios.put(`${BaseUrl}${url}`, {
        username: username,
      });

      if (response.data.http_status_code === 200) {
        Swal.fire({
          title: "Authenticated",
          icon: "success",
          text: "Account Activated Successfully!",
          confirmButtonText: "Close",
        });
        const { is_staff, is_vendor, is_superuser } = response.data;
        let redirectURL = "/user/login";

        if (is_staff && !is_superuser && !is_vendor) {
          redirectURL = "/doctor/login";
        } else if (is_vendor && !is_superuser && !is_staff) {
          redirectURL = "/vendor/login";
        } else {
          redirectURL = "/user/login";
        }

        setTimeout(() => {
          window.location.href = toPublicRoute(redirectURL);
        }, 2000);
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "This account dosen't exist",
        icon: "error",
        confirmButtonText: "Close",
      });

      setTimeout(() => {
        window.location.href = toPublicRoute("/");
      }, 1000);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isAdminPath = location.pathname.startsWith("/admin");
  const adminLogin = location.pathname.endsWith("/admin/login");
  const userLogin = location.pathname.endsWith("/user/login");
  const userRegister = location.pathname.endsWith("/user/register");
  const doctorLogin = location.pathname.endsWith("/doctor/login");
  const isDoctorPath = location.pathname.startsWith("/doctor");
  const isVendorPath = location.pathname.startsWith("/vendor");
  const vendorLogin = location.pathname.endsWith("/vendor/login");
  return (
    <>
      {adminLogin ? (
        <Suspense fallback={<LoaderH />}>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </Suspense>
      ) : null}

      {doctorLogin ? (
        <Suspense fallback={<LoaderH />}>
          <Routes>
            <Route path="/doctor/login" element={<DoctorLogin />} />
          </Routes>
        </Suspense>
      ) : null}

      {vendorLogin ? (
        <Suspense fallback={<LoaderH />}>
          <Routes>
            <Route path="/vendor/login" element={<VendorLogin />} />
          </Routes>
        </Suspense>
      ) : null}

      {userLogin ? (
        <Suspense fallback={<LoaderH />}>
          <Routes>
            <Route path="/user/login" element={<UserLogin />} />
          </Routes>
        </Suspense>
      ) : null}

      {userRegister ? (
        <Suspense fallback={<LoaderH />}>
          <Routes>
            <Route path="/user/register" element={<UserRegister />} />
          </Routes>
        </Suspense>
      ) : null}

      {isDoctorPath &&
      !adminLogin &&
      !doctorLogin &&
      !isAdminPath &&
      !vendorLogin &&
      !isVendorPath ? (
        <div className="doctor-panel-shell min-h-screen w-full bg-[#ECFEFF] text-[#134E4A] md:flex">
          <AdminHeader />
          <Suspense fallback={<LoaderH />}>
            <Routes>
              <Route path="/doctor" element={<ProtectedRoute />}>
                <Route path="/doctor" element={<DashBoard />} />
                <Route
                  path="/doctor/managepatients"
                  element={<ManagePatients />}
                />
                <Route path="/doctor/manageslots" element={<ManageSlots />} />
                <Route
                  path="/doctor/manageholidays"
                  element={<ManageHolidays />}
                />
                <Route
                  path="/doctor/manageslots/settings"
                  element={<SlotSettings />}
                />
                <Route path="/doctor/appointments" element={<Appointments />} />
                <Route
                  path="/doctor/consultationquery"
                  element={<Navigate to="/doctor" replace />}
                />
                <Route path="/doctor/messages" element={<Messages />} />
                {/*Patient Details*/}
                <Route
                  path="/doctor/appointments/patientdetails/:id"
                  element={<PatientDetails />}
                />
                <Route
                  path="/doctor/appointments/addappointments"
                  element={<AddAppointment />}
                />
                <Route
                  path="/doctor/appointments/editappointments/:id"
                  element={<EditAppointment />}
                />
                <Route
                  path="/doctor/managepatients/editpatient/:id"
                  element={<EditPatient />}
                />
                <Route
                  path="/doctor/managepatients/addpatient"
                  element={<AddPatient />}
                />
                <Route path="/doctor/myprofile" element={<MyProfile />} />
                <Route
                  path="/doctor/myprofile/editprofile"
                  element={<EditProfile />}
                />
                <Route
                  path="/doctor/changepassword"
                  element={<ChangePassword />}
                />
                <Route path="/doctor/notification" element={<Notification />} />
                <Route path="/doctor/*" element={<Navigate to="/doctor" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </div>
      ) : null}

      {isVendorPath &&
      !isDoctorPath &&
      !adminLogin &&
      !doctorLogin &&
      !isAdminPath &&
      !vendorLogin ? (
        <div className="doctor-panel-shell vendor-panel-shell min-h-screen w-full bg-[#ECFEFF] text-[#134E4A] md:flex">
          <AdminHeader />
          <Suspense fallback={<LoaderH />}>
            <Routes>
              <Route path="/vendor" element={<ProtectedRoute />}>
                <Route path="/vendor" element={<DashBoard />} />
                <Route path="/vendor/staff" element={<Staff />} />
                <Route
                  path="/vendor/managepatients"
                  element={<ManagePatients />}
                />
                <Route path="/vendor/appointments" element={<Appointments />} />
                <Route path="/vendor/messages" element={<Messages />} />
                <Route path="/vendor/inventory" element={<Inventory />} />
                <Route path="/vendor/hospital-profile" element={<HospitalManager />} />
                <Route path="/vendor/tests" element={<HospitalTests />} />
                <Route
                  path="/vendor/consultationquery"
                  element={<Navigate to="/vendor" replace />}
                />
                <Route
                  path="/vendor/managecontent"
                  element={<Navigate to="/vendor" replace />}
                />
                <Route path="/vendor/blogs" element={<Navigate to="/vendor" replace />} />
                <Route
                  path="/vendor/blogcategories"
                  element={<Navigate to="/vendor" replace />}
                />
                <Route path="/vendor/services" element={<Navigate to="/vendor" replace />} />
                <Route path="/vendor/feedback" element={<Navigate to="/vendor" replace />} />
                <Route
                  path="/vendor/manageenquiries"
                  element={<Navigate to="/vendor" replace />}
                />
                <Route path="/vendor/manageslots" element={<ManageSlots />} />
                <Route
                  path="/vendor/manageslots/settings"
                  element={<SlotSettings />}
                />
                <Route
                  path="/vendor/manageholidays"
                  element={<ManageHolidays />}
                />
                <Route
                  path="/vendor/managelocation"
                  element={<Navigate to="/vendor" replace />}
                />
                <Route
                  path="/vendor/managedepartment"
                  element={<Navigate to="/vendor" replace />}
                />
                <Route
                  path="/vendor/staff/manageroles/:username"
                  element={<ManageRoles />}
                />
                {/* Profile Pages */}
                <Route path="/vendor/myprofile" element={<MyProfile />} />
                <Route
                  path="/vendor/changepassword"
                  element={<ChangePassword />}
                />
                <Route path="/vendor/notification" element={<Notification />} />

                {/* Configuration Pages */}
                <Route path="/vendor/logochange" element={<Navigate to="/vendor" replace />} />
                <Route
                  path="/vendor/faviconchange"
                  element={<Navigate to="/vendor" replace />}
                />
                <Route
                  path="/vendor/socialmediaprofiles"
                  element={<Navigate to="/vendor" replace />}
                />
                <Route path="/vendor/timings" element={<Navigate to="/vendor" replace />} />
                <Route path="/vendor/slogantext" element={<Navigate to="/vendor" replace />} />
                <Route path="/vendor/address" element={<Navigate to="/vendor" replace />} />
                <Route path="/vendor/currencysettings" element={<Navigate to="/vendor" replace />}/>

                {/*Patient Details*/}
                <Route
                  path="/vendor/appointments/patientdetails/:id"
                  element={<PatientDetails />}
                />

                {/* Add Pages   */}

                <Route path="/vendor/blogs/addblogs" element={<Navigate to="/vendor" replace />} />
                <Route
                  path="/vendor/blogcategories/addblogcategory"
                  element={<Navigate to="/vendor" replace />}
                />

                <Route path="/vendor/staff/addstaff" element={<AddStaff />} />
                <Route
                  path="/vendor/managepatients/addpatient"
                  element={<AddPatient />}
                />

                <Route
                  path="/vendor/services/addservices"
                  element={<Navigate to="/vendor" replace />}
                />
                <Route
                  path="/vendor/appointments/addappointments"
                  element={<AddAppointment />}
                />
                <Route
                  path="/vendor/managelocation/addlocation"
                  element={<Navigate to="/vendor" replace />}
                />
                <Route
                  path="/vendor/managedepartment/adddepartment"
                  element={<Navigate to="/vendor" replace />}
                />

                {/* Edit Pages */}

                <Route
                  path="/vendor/services/editservices/:id"
                  element={<Navigate to="/vendor" replace />}
                />
                <Route
                  path="/vendor/staff/editstaff/:id"
                  element={<EditStaff />}
                />
                <Route
                  path="/vendor/managepatients/editpatient/:id"
                  element={<EditPatient />}
                />
                <Route
                  path="/vendor/blogs/editblogs/:id"
                  element={<Navigate to="/vendor" replace />}
                />
                <Route
                  path="/vendor/blogcategories/editblogcategory/:id"
                  element={<Navigate to="/vendor" replace />}
                />
                <Route
                  path="/vendor/appointments/editappointments/:id"
                  element={<EditAppointment />}
                />
                <Route
                  path="/vendor/managelocation/editlocation/:id"
                  element={<Navigate to="/vendor" replace />}
                />
                <Route
                  path="/vendor/managedepartment/editdepartment/:id"
                  element={<Navigate to="/vendor" replace />}
                />
                <Route
                  path="/vendor/myprofile/editprofile"
                  element={<EditProfile />}
                />
                <Route
                  path="/vendor/managecontent/editcontent/:slug"
                  element={<Navigate to="/vendor" replace />}
                />
                <Route path="/vendor/*" element={<Navigate to="/vendor" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </div>
      ) : null}

      {isAdminPath &&
      !adminLogin &&
      !doctorLogin &&
      !isDoctorPath &&
      !vendorLogin &&
      !isVendorPath ? (
        // Admin routes
        <div className="doctor-panel-shell admin-panel-shell min-h-screen w-full bg-[#ECFEFF] text-[#134E4A] md:flex">
          <AdminHeader />
          <Suspense fallback={<LoaderH />}>
            <Routes>
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route path="/admin" element={<DashBoard />} />
                <Route path="/admin/vendor" element={<ManageVendor />} />
                <Route path="/admin/staff" element={<Staff />} />
                <Route
                  path="/admin/managepatients"
                  element={<ManagePatients />}
                />
                <Route path="/admin/appointments" element={<Appointments />} />
                <Route
                  path="/admin/consultationquery"
                  element={<ConsultationQuery />}
                />
                <Route
                  path="/admin/managecontent"
                  element={<ManageContent />}
                />
                <Route path="/admin/blogs" element={<Blogs />} />
                <Route
                  path="/admin/blogcategories"
                  element={<ManageBlogCategories />}
                />
                <Route path="/admin/services" element={<AdminServices />} />
                <Route path="/admin/feedback" element={<ManageFeedback />} />
                <Route path="/admin/messages" element={<Messages />} />
                <Route path="/admin/inventory" element={<Inventory />} />
                <Route path="/admin/hospital-profile" element={<HospitalManager />} />
                <Route path="/admin/tests" element={<HospitalTests />} />
                <Route
                  path="/admin/staff/manageroles/:username"
                  element={<ManageRoles />}
                />
                <Route
                  path="/admin/vendor/manageroles/:username"
                  element={<ManageRoles />}
                />
                <Route
                  path="/admin/manageenquiries"
                  element={<ManageContact />}
                />
                <Route path="/admin/manageslots" element={<ManageSlots />} />
                <Route
                  path="/admin/managelocation"
                  element={<ManageLocation />}
                />
                <Route
                  path="/admin/managedepartment"
                  element={<ManageDepartment />}
                />
                {/* Profile Pages */}
                <Route path="/admin/myprofile" element={<MyProfile />} />
                <Route
                  path="/admin/changepassword"
                  element={<ChangePassword />}
                />
                <Route path="/admin/notification" element={<Notification />} />

                {/* Configuration Pages */}
                <Route path="/admin/logochange" element={<LogoChange />} />
                <Route
                  path="/admin/faviconchange"
                  element={<FaviconChange />}
                />
                <Route
                  path="/admin/socialmediaprofiles"
                  element={<SocialMediaProfiles />}
                />
                <Route path="/admin/timings" element={<Timings />} />
                <Route path="/admin/slogantext" element={<SloganText />} />
                <Route path="/admin/address" element={<Address />} />
                <Route path="/admin/currencysettings" element={<CurrencySettings />}/>
                {/* Add Pages   */}

                <Route path="/admin/blogs/addblogs" element={<AddBlog />} />
                <Route
                  path="/admin/blogcategories/addblogcategory"
                  element={<AddBlogCategory />}
                />

                <Route path="/admin/vendor/addvendor" element={<AddVendor />} />
                <Route path="/admin/staff/addstaff" element={<AddStaff />} />
                <Route
                  path="/admin/managepatients/addpatient"
                  element={<AddPatient />}
                />
                <Route
                  path="/admin/services/addservices"
                  element={<AddService />}
                />
                <Route
                  path="/admin/appointments/addappointments"
                  element={<AddAppointment />}
                />
                <Route
                  path="/admin/managelocation/addlocation"
                  element={<AddLocation />}
                />
                <Route
                  path="/admin/managedepartment/adddepartment"
                  element={<AddDepartment />}
                />
                {/*Patient Details*/}
                <Route
                  path="/admin/appointments/patientdetails/:id"
                  element={<PatientDetails />}
                />
                {/* Edit Pages */}
                <Route
                  path="/admin/vendor/editvendor/:id"
                  element={<EditVendor />}
                />
                <Route
                  path="/admin/services/editservices/:id"
                  element={<EditService />}
                />
                <Route
                  path="/admin/staff/editstaff/:id"
                  element={<EditStaff />}
                />
                <Route
                  path="/admin/managepatients/editpatient/:id"
                  element={<EditPatient />}
                />
                <Route
                  path="/admin/blogs/editblogs/:id"
                  element={<EditBlog />}
                />
                <Route
                  path="/admin/blogcategories/editblogcategory/:id"
                  element={<EditBlogCategory />}
                />
                <Route
                  path="/admin/appointments/editappointments/:id"
                  element={<EditAppointment />}
                />
                <Route
                  path="/admin/managelocation/editlocation/:id"
                  element={<EditLocation />}
                />
                <Route
                  path="/admin/managedepartment/editdepartment/:id"
                  element={<EditDepartment />}
                />
                <Route
                  path="/admin/myprofile/editprofile"
                  element={<EditProfile />}
                />
                <Route
                  path="/admin/managecontent/editcontent/:slug"
                  element={<EditContent />}
                />
                <Route
                  path="/admin/setupnotification"
                  element={<SetupNotification />}
                />
              </Route>
            </Routes>
          </Suspense>
        </div>
      ) : !adminLogin &&
        !isAdminPath &&
        !doctorLogin &&
        !isDoctorPath &&
        !vendorLogin &&
        !isVendorPath &&
        !userLogin &&
        !userRegister ? (
        <>
          <Header />
          <Suspense fallback={<LoaderH />}>
            <Routes>
              <Route
                path="/authenticate/user/:username"
                element={<Authenticate />}
              />
              <Route path="/user/login" element={<UserLogin />} />
              <Route path="/user/register" element={<UserRegister />} />
              <Route
                path="/dashboard"
                element={
                  <PatientProtectedRoute>
                    <Userdashboard />
                  </PatientProtectedRoute>
                }
              />
              <Route
                path="/userprofile"
                element={
                  <PatientProtectedRoute>
                    <Profile />
                  </PatientProtectedRoute>
                }
              />
              <Route
                path="/userprofile/:username"
                element={
                  <PatientProtectedRoute>
                    <EditUserProfile />
                  </PatientProtectedRoute>
                }
              />
              <Route
                path="/passwordchange"
                element={
                  <PatientProtectedRoute>
                    <PasswordChange />
                  </PatientProtectedRoute>
                }
              />
              <Route
                path="/userappointments"
                element={
                  <PatientProtectedRoute>
                    <UserAppointments />
                  </PatientProtectedRoute>
                }
              />
              <Route
                path="/userdocuments"
                element={
                  <PatientProtectedRoute>
                    <UserDocuments />
                  </PatientProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <PatientProtectedRoute>
                    <UserMessages />
                  </PatientProtectedRoute>
                }
              />

              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/hospitals" element={<Hospitals />} />
              <Route path="/hospitals/:hospitalId" element={<HospitalProfile />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/payment" element={<PaymentPage />}/>
              <Route path="/contactus" element={<ContactUs />} />
              <Route path="/services" element={<Services />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/profiledoctor/:id" element={<DoctorProfile />} />
              <Route path="/ourdoctors" element={<DoctorListing/>}/>
              <Route path="/getdetails" element={<GetDetails />} />
              <Route path="/blogpage/:id" element={<BlogPage />} />
              <Route path="/privacypolicy" element={<PrivacyPolicy />} />
              <Route path="/termsofservice" element={<TermsofService />} />
              {/* <Route path="*" element={<Error />} /> */}
              <Route path="/loader" element={<LoaderH />} />
            </Routes>
          </Suspense>
          <Footer />
        </>
      ) : null}
    </>
  );
};

export default App;
