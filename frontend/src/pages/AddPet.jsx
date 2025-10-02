import { useState, useMemo } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { petsAPI } from '@/api';

const SPECIES = ['cat', 'dog', 'bird', 'hamster', 'other'];
const PRIVACY = ['private', 'public'];

export default function AddPet() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: '',
    species: 'cat',
    breed: '',
    birthday: '',        // yyyy-mm-dd
    color: '',
    birthplace: '',
    location: '',
    photo_url: '',
    bio: '',
    privacy: 'private',
  });

  const canSubmit = useMemo(() => {
    return form.name.trim().length > 0 && form.species.trim().length > 0 && !loading;
  }, [form, loading]);

  const handleChange = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        species: form.species.trim(),
        breed: form.breed || undefined,
        birthday: form.birthday || undefined,
        bio: form.bio || undefined,
        color: form.color || undefined,
        birthplace: form.birthplace || undefined,
        location: form.location || undefined,
        photo_url: form.photo_url || undefined,
        privacy: form.privacy || undefined,
      };

      await petsAPI.create(payload);
      navigate('/pets', { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors ||
        err?.message ||
        'Не удалось создать питомца';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Добавить питомца</h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white/80 dark:bg-gray-900/60 p-5 rounded-xl border border-gray-200/50 dark:border-gray-700/40">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Имя*</label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-black/60 text-gray-900 dark:text-gray-100"
              placeholder="Мия"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Вид*</label>
            <select
              value={form.species}
              onChange={handleChange('species')}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-black/60 text-gray-900 dark:text-gray-100"
            >
              {SPECIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Порода</label>
            <input
              type="text"
              value={form.breed}
              onChange={handleChange('breed')}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-black/60 text-gray-900 dark:text-gray-100"
              placeholder="Сиамская кошка"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Дата рождения</label>
            <input
              type="date"
              value={form.birthday}
              onChange={handleChange('birthday')}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-black/60 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Цвет</label>
            <input
              type="text"
              value={form.color}
              onChange={handleChange('color')}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-black/60 text-gray-900 dark:text-gray-100"
              placeholder="tortoiseshell"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Место рождения</label>
            <input
              type="text"
              value={form.birthplace}
              onChange={handleChange('birthplace')}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-black/60 text-gray-900 dark:text-gray-100"
              placeholder="Алматы"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Текущее место</label>
            <input
              type="text"
              value={form.location}
              onChange={handleChange('location')}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-black/60 text-gray-900 dark:text-gray-100"
              placeholder="Алматы"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Приватность</label>
            <select
              value={form.privacy}
              onChange={handleChange('privacy')}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-black/60 text-gray-900 dark:text-gray-100"
            >
              {PRIVACY.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Фото (URL)</label>
            <input
              type="url"
              value={form.photo_url}
              onChange={handleChange('photo_url')}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-black/60 text-gray-900 dark:text-gray-100"
              placeholder="https://..."
            />
            {form.photo_url && (
              <img
                src={form.photo_url}
                alt="preview"
                className="mt-2 h-32 w-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Описание</label>
            <textarea
              rows={4}
              value={form.bio}
              onChange={handleChange('bio')}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-black/60 text-gray-900 dark:text-gray-100 resize-y"
              placeholder="Коротко о питомце…"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Сохранение…' : 'Добавить'}
          </button>
          <NavLink to="/pets" className="text-gray-600 dark:text-gray-300 hover:underline">
            Отмена
          </NavLink>
        </div>
      </form>
    </div>
  );
}
