import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Dashboard } from '../pages/Dashboard';
import { NewAppointment } from '../pages/NewAppointment';
import { PrivateRoute } from './PrivateRoute'; 
import { ForgotPassword } from '../pages/ForgotPassword';
import { ManageServices } from '../pages/ManageServices';
import { ManageProfessionals } from '../pages/ManageProfessionals';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/new-appointment" 
          element={
            <PrivateRoute>
              <NewAppointment />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/manage-services" 
          element={
            <PrivateRoute>
              <ManageServices />
            </PrivateRoute>
          } 
        />
        
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      
      <Route 
          path="/manage-professionals" 
          element={
            <PrivateRoute>
              <ManageProfessionals />
            </PrivateRoute>
          } 
        />
    </BrowserRouter>
  );
}