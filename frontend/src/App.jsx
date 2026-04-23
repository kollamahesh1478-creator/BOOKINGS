import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Patient Pages
import PatientLogin from './pages/Patient/Login';
import PatientRegister from './pages/Patient/Register';
import PatientDashboard from './pages/Patient/Dashboard';
import BookAppointment from './pages/Patient/BookAppointment';
import MyAppointments from './pages/Patient/MyAppointments';
import PatientProfile from './pages/Patient/Profile';
import PaymentPage from './pages/Patient/Payment';

// Admin Pages
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageDoctors from './pages/Admin/ManageDoctors';
import ManageAppointments from './pages/Admin/ManageAppointments';
import PaymentReports from './pages/Admin/PaymentReports';
import ManageSpecialties from './pages/Admin/ManageSpecialties';
import ManageSettings from './pages/Admin/ManageSettings';

// Public Pages
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Contact from './pages/Contact';

// Layouts
import PatientLayout from './layouts/PatientLayout';
import AdminLayout from './layouts/AdminLayout';
import Navbar from './components/Navbar';

function App() {
    const { isAuthenticated, user } = useAuthStore();

    return (
        <Router>
            <Toaster position="top-right" />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<><Navbar /><Home /></>} />
                <Route path="/doctors" element={<><Navbar /><Doctors /></>} />
                <Route path="/contact" element={<><Navbar /><Contact /></>} />

                {/* Patient Routes */}
                <Route path="/patient/login" element={isAuthenticated && user?.role === 'patient' ? <Navigate to="/patient/dashboard" /> : <PatientLogin />} />
                <Route path="/patient/register" element={isAuthenticated && user?.role === 'patient' ? <Navigate to="/patient/dashboard" /> : <PatientRegister />} />

                <Route path="/patient/*" element={
                    isAuthenticated && user?.role === 'patient' ? (
                        <PatientLayout>
                            <Routes>
                                <Route path="dashboard" element={<PatientDashboard />} />
                                <Route path="book-appointment" element={<BookAppointment />} />
                                <Route path="appointments" element={<MyAppointments />} />
                                <Route path="profile" element={<PatientProfile />} />
                                <Route path="payment/:appointmentId" element={<PaymentPage />} />
                            </Routes>
                        </PatientLayout>
                    ) : (
                        <Navigate to="/patient/login" />
                    )
                } />

                {/* Admin Routes */}
                <Route path="/admin/login" element={isAuthenticated && user?.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <AdminLogin />} />

                <Route path="/admin/*" element={
                    isAuthenticated && user?.role === 'admin' ? (
                        <AdminLayout>
                            <Routes>
                                <Route path="dashboard" element={<AdminDashboard />} />
                                <Route path="users" element={<ManageUsers />} />
                                <Route path="doctors" element={<ManageDoctors />} />
                                <Route path="appointments" element={<ManageAppointments />} />
                                <Route path="payments" element={<PaymentReports />} />
                                <Route path="specialties" element={<ManageSpecialties />} />
                            </Routes>
                        </AdminLayout>
                    ) : (
                        <Navigate to="/admin/login" />
                    )
                } />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
