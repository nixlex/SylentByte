import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Price from './pages/Price';
import About from './pages/About';
import Manuals from './pages/Manuals';
import Specialists from './pages/Specialists';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/price" element={<Price />} />
        <Route path="/about" element={<About />} />
        <Route path="/manuals" element={<Manuals />} />
        <Route path="/specials" element={<Specialists />} />
      </Routes>
    </Router>
  );
}
