import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(userData);
    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    loadUsers();
  }, [navigate]);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUsers(result.data);
        }
      }
    } catch (err) {
      console.error('Ошибка загрузки пользователей:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePermission = async (userId, currentCanEdit) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/users/${userId}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ can_edit: !currentCanEdit })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        loadUsers();
      } else {
        alert(result.error || 'Ошибка обновления прав');
      }
    } catch (err) {
      alert('Ошибка подключения к серверу');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Header />
      <main className="p-4 sm:p-8 max-w-[1400px] mx-auto">
        <section className="mb-6 sm:mb-8 animate-fadeIn">
          <h1 className="text-[#4CAF50] text-2xl sm:text-3xl mb-2">Панель администратора</h1>
          <p className="text-[#cccccc]">Управление правами пользователей</p>
        </section>

        <div className="bg-[#2d2d2d] p-4 sm:p-6 rounded-lg border border-[#4CAF50] animate-slideInUp">
          <h2 className="text-[#4CAF50] text-xl mb-4">Пользователи</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#4CAF50]">
                  <th className="text-left p-3 text-[#4CAF50]">ID</th>
                  <th className="text-left p-3 text-[#4CAF50]">Имя</th>
                  <th className="text-left p-3 text-[#4CAF50]">Email</th>
                  <th className="text-left p-3 text-[#4CAF50]">Роль</th>
                  <th className="text-left p-3 text-[#4CAF50]">Право на редактирование</th>
                  <th className="text-left p-3 text-[#4CAF50]">Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-[#3d3d3d] hover:bg-[#3d3d3d] transition-colors">
                    <td className="p-3 text-[#cccccc]">{user.id}</td>
                    <td className="p-3 text-[#cccccc]">{user.name || '-'}</td>
                    <td className="p-3 text-[#cccccc]">{user.email}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded text-sm ${
                        user.role === 'admin' ? 'bg-purple-600' : 'bg-gray-600'
                      }`}>
                        {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded text-sm ${
                        user.can_edit ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        {user.can_edit ? 'Да' : 'Нет'}
                      </span>
                    </td>
                    <td className="p-3">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleTogglePermission(user.id, user.can_edit)}
                          className={`px-4 py-2 rounded text-sm transition-all ${
                            user.can_edit
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-[#4CAF50] hover:bg-[#45a049] text-white'
                          }`}
                        >
                          {user.can_edit ? 'Забрать права' : 'Дать права'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

