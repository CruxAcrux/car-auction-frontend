import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CarAdDetail from './pages/CarAdDetail';
import CreateAd from './pages/CreateAd';
import EditAd from './pages/EditAd';
import Login from './pages/Login';
import Register from './pages/Register';
import MyListings from './pages/MyListings';
import ProtectedRoute from './components/ProtectedRoute';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/car-ad/:id" element={<CarAdDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route
              path="/create-ad"
              element={
                <ProtectedRoute>
                  <CreateAd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-ad/:id"
              element={
                <ProtectedRoute>
                  <EditAd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-listings"
              element={
                <ProtectedRoute>
                  <MyListings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;