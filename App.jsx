import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import Home from './pages/Home';
import Objects from './pages/Objects';
import ObjectPage from './pages/ObjectPage'; // Создайте этот файл в папке pages
import Services from './pages/Services';
import Contacts from './pages/Contacts';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <div className="app">
      <ParticleBackground />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/objects" element={<Objects />} />
          <Route path="/objects/:id" element={<ObjectPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;