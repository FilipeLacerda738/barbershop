/* eslint-disable no-unused-vars */
import { Toaster } from 'react-hot-toast';
import { AppRoutes } from './routes';
import { AuthProvider } from './context/AuthContext';


function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster position="top-right" reverseOrder={false} />
    </AuthProvider>
  );
}

export default App;