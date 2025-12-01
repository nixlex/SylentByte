import { useState, useEffect } from 'react';

export default function ProjectForm({ project, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    project: '',
    status: 'pending',
    date: '',
    amount: ''
  });

  useEffect(() => {
    if (project) {
      setFormData({
        project: project.project || '',
        status: project.status || 'pending',
        date: project.date || '',
        amount: project.amount || ''
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        project: '',
        status: 'pending',
        date: today,
        amount: ''
      });
    }
  }, [project]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      amount: parseInt(formData.amount)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[#cccccc] mb-2">Название проекта</label>
        <input
          type="text"
          value={formData.project}
          onChange={(e) => setFormData({ ...formData, project: e.target.value })}
          required
          className="w-full px-4 py-2 bg-[#3d3d3d] border border-[#4CAF50] rounded text-white focus:outline-none focus:border-cyan-400"
          placeholder="Веб-пентест"
        />
      </div>

      <div>
        <label className="block text-[#cccccc] mb-2">Статус</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          required
          className="w-full px-4 py-2 bg-[#3d3d3d] border border-[#4CAF50] rounded text-white focus:outline-none focus:border-cyan-400"
        >
          <option value="pending">Ожидание</option>
          <option value="in_progress">В работе</option>
          <option value="completed">Завершено</option>
        </select>
      </div>

      <div>
        <label className="block text-[#cccccc] mb-2">Дата</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
          className="w-full px-4 py-2 bg-[#3d3d3d] border border-[#4CAF50] rounded text-white focus:outline-none focus:border-cyan-400"
        />
      </div>

      <div>
        <label className="block text-[#cccccc] mb-2">Сумма (₽)</label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
          min="0"
          className="w-full px-4 py-2 bg-[#3d3d3d] border border-[#4CAF50] rounded text-white focus:outline-none focus:border-cyan-400"
          placeholder="30000"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-[#4CAF50] text-white py-2 rounded hover:bg-[#45a049] transition-all"
        >
          {project ? 'Сохранить' : 'Добавить'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-[#3d3d3d] text-white py-2 rounded hover:bg-[#4d4d4d] transition-all border border-[#4CAF50]"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}

