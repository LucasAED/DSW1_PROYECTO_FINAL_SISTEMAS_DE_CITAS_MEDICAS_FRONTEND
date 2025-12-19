import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import DoctorsManager from './pages/DoctorsManager';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/doctors" element={<DoctorsManager />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;