import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import AddUser from './components/AddUser.jsx';
import Header from './components/Header.jsx';
import UserManagement from './components/UserManagement.jsx';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<AddUser />} />
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
