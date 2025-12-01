import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProjectForm from '../components/ProjectForm';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [canEdit, setCanEdit] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/dashboard/data', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setData(result.data);
          setFilteredData(result.data);
          if (result.user) {
            setCanEdit(result.user.can_edit || false);
          }
        } else {
          throw new Error(result.error);
        }
      } else {
        throw new Error('Ошибка загрузки данных');
      }
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
    }
  };

  const handleSaveProject = async (projectData) => {
    try {
      const token = localStorage.getItem('token');
      const url = editingProject
        ? `http://localhost:3000/api/projects/${editingProject.id}`
        : 'http://localhost:3000/api/projects';

      const method = editingProject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        loadDashboardData();
        setShowForm(false);
        setEditingProject(null);
      } else {
        alert(result.error || 'Ошибка сохранения проекта');
      }
    } catch (err) {
      alert('Ошибка подключения к серверу');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот проект?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        loadDashboardData();
      } else {
        alert(result.error || 'Ошибка удаления проекта');
      }
    } catch (err) {
      alert('Ошибка подключения к серверу');
    }
  };


  useEffect(() => {
    let filtered = [...data];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });

    setFilteredData(filtered);
  }, [data, sortField, sortOrder, filterStatus]);

  const getLineData = () => {
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    const monthlyData = new Array(12).fill(0);

    data.forEach(project => {
      const date = new Date(project.date);
      const month = date.getMonth();
      if (project.status === 'completed') {
        monthlyData[month] += project.amount;
      }
    });

    return {
      labels: months,
      datasets: [
        {
          label: 'Доходы',
          data: monthlyData,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4
        }
      ]
    };
  };

  const getBarData = () => {
    const projectTypes = {};
    data.forEach(project => {
      projectTypes[project.project] = (projectTypes[project.project] || 0) + 1;
    });

    const labels = Object.keys(projectTypes);
    const values = Object.values(projectTypes);

    return {
      labels: labels.length > 0 ? labels : ['Нет данных'],
      datasets: [
        {
          label: 'Проекты',
          data: values.length > 0 ? values : [0],
          backgroundColor: ['#4CAF50', '#45a049', '#66BB6A', '#81C784', '#A5D6A7']
        }
      ]
    };
  };

  const getDoughnutData = () => {
    const completed = data.filter(d => d.status === 'completed').length;
    const inProgress = data.filter(d => d.status === 'in_progress').length;
    const pending = data.filter(d => d.status === 'pending').length;

    return {
      labels: ['Завершено', 'В работе', 'Ожидание'],
      datasets: [
        {
          data: [completed, inProgress, pending],
          backgroundColor: ['#4CAF50', '#FFA726', '#EF5350']
        }
      ]
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'in_progress': return 'bg-yellow-600';
      case 'pending': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Завершено';
      case 'in_progress': return 'В работе';
      case 'pending': return 'Ожидание';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Header />
      <main className="p-4 sm:p-8 max-w-[1400px] mx-auto w-full overflow-x-hidden">
        <section className="mb-6 sm:mb-8 animate-fadeIn">
          <h1 className="text-[#4CAF50] text-2xl sm:text-3xl mb-2">Личный кабинет</h1>
          {user && (
            <p className="text-[#cccccc]">Добро пожаловать, {user.name || user.email}!</p>
          )}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-[#2d2d2d] p-4 sm:p-6 rounded-lg border border-[#4CAF50] animate-slideInUp">
            <h3 className="text-[#cccccc] text-sm mb-2">Всего проектов</h3>
            <p className="text-[#4CAF50] text-2xl sm:text-3xl font-bold">{data.length}</p>
          </div>
          <div className="bg-[#2d2d2d] p-4 sm:p-6 rounded-lg border border-[#4CAF50] animate-slideInUp" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-[#cccccc] text-sm mb-2">Завершено</h3>
            <p className="text-[#4CAF50] text-2xl sm:text-3xl font-bold">
              {data.filter(d => d.status === 'completed').length}
            </p>
          </div>
          <div className="bg-[#2d2d2d] p-4 sm:p-6 rounded-lg border border-[#4CAF50] animate-slideInUp" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-[#cccccc] text-sm mb-2">В работе</h3>
            <p className="text-[#4CAF50] text-2xl sm:text-3xl font-bold">
              {data.filter(d => d.status === 'in_progress').length}
            </p>
          </div>
          <div className="bg-[#2d2d2d] p-4 sm:p-6 rounded-lg border border-[#4CAF50] animate-slideInUp" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-[#cccccc] text-sm mb-2">Общая сумма</h3>
            <p className="text-[#4CAF50] text-2xl sm:text-3xl font-bold">
              {data.reduce((sum, d) => sum + d.amount, 0).toLocaleString()} ₽
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-[#2d2d2d] p-4 sm:p-6 rounded-lg border border-[#4CAF50] animate-slideInUp overflow-hidden">
            <h2 className="text-[#4CAF50] text-xl mb-4">Динамика доходов</h2>
            <div className="h-[250px] sm:h-[300px]">
              <Line
                data={getLineData()}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      labels: { color: '#cccccc' }
                    }
                  },
                  scales: {
                    x: {
                      ticks: { color: '#cccccc' },
                      grid: { color: '#3d3d3d' }
                    },
                    y: {
                      ticks: { color: '#cccccc' },
                      grid: { color: '#3d3d3d' }
                    }
                  }
                }}
              />
            </div>
          </div>
          <div className="bg-[#2d2d2d] p-4 sm:p-6 rounded-lg border border-[#4CAF50] animate-slideInUp overflow-hidden">
            <h2 className="text-[#4CAF50] text-xl mb-4">Распределение проектов</h2>
            <div className="h-[250px] sm:h-[300px]">
              <Doughnut
                data={getDoughnutData()}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      labels: { color: '#cccccc' },
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#2d2d2d] p-4 sm:p-6 rounded-lg border border-[#4CAF50] mb-6 sm:mb-8 animate-slideInUp overflow-hidden">
          <h2 className="text-[#4CAF50] text-xl mb-4">Статистика по типам</h2>
          <div className="h-[250px] sm:h-[300px]">
            <Bar
              data={getBarData()}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: {
                    labels: { color: '#cccccc' },
                    display: false
                  }
                },
                scales: {
                  x: {
                    ticks: { color: '#cccccc' },
                    grid: { color: '#3d3d3d' }
                  },
                  y: {
                    ticks: { color: '#cccccc' },
                    grid: { color: '#3d3d3d' }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-[#2d2d2d] p-4 sm:p-6 rounded-lg border border-[#4CAF50] animate-slideInUp">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h2 className="text-[#4CAF50] text-xl">Проекты</h2>
            <div className="flex flex-wrap gap-2">
              {canEdit && (
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setShowForm(true);
                  }}
                  className="px-4 py-2 bg-[#4CAF50] text-white rounded hover:bg-[#45a049] transition-all"
                >
                  + Добавить проект
                </button>
              )}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-[#3d3d3d] border border-[#4CAF50] rounded text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="all">Все статусы</option>
                <option value="completed">Завершено</option>
                <option value="in_progress">В работе</option>
                <option value="pending">Ожидание</option>
              </select>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="px-4 py-2 bg-[#3d3d3d] border border-[#4CAF50] rounded text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="date">Дата</option>
                <option value="project">Проект</option>
                <option value="amount">Сумма</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-2 bg-[#4CAF50] text-white rounded hover:bg-[#45a049] transition-all"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto -mx-4 sm:-mx-6">
            <div className="inline-block min-w-full align-middle">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#4CAF50]">
                    <th className="text-left p-3 text-[#4CAF50] whitespace-nowrap">Проект</th>
                    <th className="text-left p-3 text-[#4CAF50] whitespace-nowrap">Статус</th>
                    <th className="text-left p-3 text-[#4CAF50] whitespace-nowrap">Дата</th>
                    <th className="text-left p-3 text-[#4CAF50] whitespace-nowrap">Сумма</th>
                    {canEdit && (
                      <th className="text-left p-3 text-[#4CAF50] whitespace-nowrap">Действия</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr key={item.id} className="border-b border-[#3d3d3d] hover:bg-[#3d3d3d] transition-colors">
                        <td className="p-3 text-[#cccccc]">{item.project}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded text-sm whitespace-nowrap ${getStatusColor(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                        </td>
                        <td className="p-3 text-[#cccccc] whitespace-nowrap">{item.date}</td>
                        <td className="p-3 text-[#4CAF50] font-semibold whitespace-nowrap">{item.amount.toLocaleString()} ₽</td>
                        {canEdit && (
                          <td className="p-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingProject(item);
                                  setShowForm(true);
                                }}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-all"
                              >
                                Изменить
                              </button>
                              <button
                                onClick={() => handleDeleteProject(item.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-all"
                              >
                                Удалить
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-[#cccccc]">
                        Нет данных для отображения
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-[#2d2d2d] p-6 rounded-lg border-2 border-[#4CAF50] w-full max-w-md animate-slideDown">
              <h2 className="text-[#4CAF50] text-xl mb-4">
                {editingProject ? 'Редактировать проект' : 'Добавить проект'}
              </h2>
              <ProjectForm
                project={editingProject}
                onSave={handleSaveProject}
                onCancel={() => {
                  setShowForm(false);
                  setEditingProject(null);
                }}
              />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
