import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';

interface Weather {
  id: number;
  city: string;
  temperature: string; // e.g. '76°F'
  description: string; // e.g. 'Sunny'
  high?: string; // e.g. '79°'
  low?: string; // e.g. '56°'
  hourly?: { time: string; temp: string; icon: string }[];
  forecast?: { day: string; high: string; low: string; icon: string }[];
}

const initialWeather: Weather[] = [
  {
    id: 1,
    city: 'Cupertino',
    temperature: '76°',
    description: 'Sunny',
    high: '79°',
    low: '56°',
    hourly: [
      { time: 'Now', temp: '76°', icon: '☀️' },
      { time: '10AM', temp: '77°', icon: '☀️' },
      { time: '11AM', temp: '77°', icon: '☀️' },
      { time: '12PM', temp: '77°', icon: '☀️' },
      { time: '1PM', temp: '78°', icon: '☀️' },
      { time: '2PM', temp: '79°', icon: '☀️' },
    ],
    forecast: [
      { day: 'Today', high: '79°', low: '56°', icon: '☀️' },
      { day: 'Tue', high: '71°', low: '55°', icon: '☀️' },
      { day: 'Wed', high: '68°', low: '46°', icon: '☀️' },
      { day: 'Thu', high: '71°', low: '55°', icon: '☀️' },
      { day: 'Fri', high: '71°', low: '55°', icon: '☀️' },
      { day: 'Sat', high: '66°', low: '46°', icon: '☀️' },
    ],
  },
  {
    id: 2,
    city: 'Ho Chi Minh City',
    temperature: '88°',
    description: 'Hot and sunny',
    high: '90°',
    low: '78°',
    hourly: [
      { time: 'Now', temp: '88°', icon: '☀️' },
      { time: '10AM', temp: '89°', icon: '☀️' },
      { time: '11AM', temp: '90°', icon: '☀️' },
      { time: '12PM', temp: '90°', icon: '☀️' },
      { time: '1PM', temp: '89°', icon: '☀️' },
      { time: '2PM', temp: '88°', icon: '☀️' },
    ],
    forecast: [
      { day: 'Today', high: '90°', low: '78°', icon: '☀️' },
      { day: 'Tue', high: '89°', low: '77°', icon: '☀️' },
      { day: 'Wed', high: '88°', low: '76°', icon: '☀️' },
      { day: 'Thu', high: '87°', low: '75°', icon: '☀️' },
      { day: 'Fri', high: '86°', low: '74°', icon: '☀️' },
      { day: 'Sat', high: '85°', low: '73°', icon: '☀️' },
    ],
  },
  {
    id: 3,
    city: 'New York',
    temperature: '65°',
    description: 'Cloudy',
    high: '68°',
    low: '55°',
    hourly: [
      { time: 'Now', temp: '65°', icon: '☁️' },
      { time: '10AM', temp: '66°', icon: '☁️' },
      { time: '11AM', temp: '67°', icon: '☁️' },
      { time: '12PM', temp: '67°', icon: '☁️' },
      { time: '1PM', temp: '68°', icon: '☁️' },
      { time: '2PM', temp: '68°', icon: '☁️' },
    ],
    forecast: [
      { day: 'Today', high: '68°', low: '55°', icon: '☁️' },
      { day: 'Tue', high: '67°', low: '54°', icon: '☁️' },
      { day: 'Wed', high: '66°', low: '53°', icon: '☁️' },
      { day: 'Thu', high: '65°', low: '52°', icon: '☁️' },
      { day: 'Fri', high: '64°', low: '51°', icon: '☁️' },
      { day: 'Sat', high: '63°', low: '50°', icon: '☁️' },
    ],
  },
  {
    id: 4,
    city: 'London',
    temperature: '58°',
    description: 'Rainy',
    high: '60°',
    low: '50°',
    hourly: [
      { time: 'Now', temp: '58°', icon: '🌧️' },
      { time: '10AM', temp: '59°', icon: '🌧️' },
      { time: '11AM', temp: '59°', icon: '🌧️' },
      { time: '12PM', temp: '60°', icon: '🌧️' },
      { time: '1PM', temp: '60°', icon: '🌧️' },
      { time: '2PM', temp: '60°', icon: '🌧️' },
    ],
    forecast: [
      { day: 'Today', high: '60°', low: '50°', icon: '🌧️' },
      { day: 'Tue', high: '59°', low: '49°', icon: '🌧️' },
      { day: 'Wed', high: '58°', low: '48°', icon: '🌧️' },
      { day: 'Thu', high: '57°', low: '47°', icon: '🌧️' },
      { day: 'Fri', high: '56°', low: '46°', icon: '🌧️' },
      { day: 'Sat', high: '55°', low: '45°', icon: '🌧️' },
    ],
  },
  {
    id: 5,
    city: 'Tokyo',
    temperature: '72°',
    description: 'Clear',
    high: '75°',
    low: '65°',
    hourly: [
      { time: 'Now', temp: '72°', icon: '🌕' },
      { time: '10AM', temp: '73°', icon: '🌕' },
      { time: '11AM', temp: '74°', icon: '🌕' },
      { time: '12PM', temp: '75°', icon: '🌕' },
      { time: '1PM', temp: '75°', icon: '🌕' },
      { time: '2PM', temp: '75°', icon: '🌕' },
    ],
    forecast: [
      { day: 'Today', high: '75°', low: '65°', icon: '🌕' },
      { day: 'Tue', high: '74°', low: '64°', icon: '🌕' },
      { day: 'Wed', high: '73°', low: '63°', icon: '🌕' },
      { day: 'Thu', high: '72°', low: '62°', icon: '🌕' },
      { day: 'Fri', high: '71°', low: '61°', icon: '🌕' },
      { day: 'Sat', high: '70°', low: '60°', icon: '🌕' },
    ],
  },
  // Add 10 more mockup cities with similar structure
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 6 + i,
    city: `City ${i + 1}`,
    temperature: `${60 + i}°`,
    description: ['Sunny', 'Cloudy', 'Rainy', 'Clear', 'Windy'][i % 5],
    high: `${65 + i}°`,
    low: `${55 + i}°`,
    hourly: [
      { time: 'Now', temp: `${60 + i}°`, icon: '☀️' },
      { time: '10AM', temp: `${61 + i}°`, icon: '☀️' },
      { time: '11AM', temp: `${62 + i}°`, icon: '☀️' },
      { time: '12PM', temp: `${63 + i}°`, icon: '☀️' },
      { time: '1PM', temp: `${64 + i}°`, icon: '☀️' },
      { time: '2PM', temp: `${65 + i}°`, icon: '☀️' },
    ],
    forecast: [
      { day: 'Today', high: `${65 + i}°`, low: `${55 + i}°`, icon: '☀️' },
      { day: 'Tue', high: `${64 + i}°`, low: `${54 + i}°`, icon: '☀️' },
      { day: 'Wed', high: `${63 + i}°`, low: `${53 + i}°`, icon: '☀️' },
      { day: 'Thu', high: `${62 + i}°`, low: `${52 + i}°`, icon: '☀️' },
      { day: 'Fri', high: `${61 + i}°`, low: `${51 + i}°`, icon: '☀️' },
      { day: 'Sat', high: `${60 + i}°`, low: `${50 + i}°`, icon: '☀️' },
    ],
  })),
];

const WeatherDetail: React.FC<{ weather: Weather; onClose: () => void }> = ({ weather, onClose }) => (
  <div style={{
    maxWidth: 350,
    minWidth: 300,
    margin: '0 auto',
    background: 'linear-gradient(180deg, #4f8ef7 0%, #7ec8e3 100%)',
    borderRadius: 32,
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    color: 'white',
    padding: 32,
    fontFamily: 'Segoe UI, sans-serif',
    position: 'relative',
    minHeight: 600,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }}>
    <button onClick={onClose} style={{ position: 'absolute', top: 24, right: 24, background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, color: 'white', fontWeight: 600, padding: '6px 16px', cursor: 'pointer', fontSize: 20 }}>✖️</button>
    <div style={{ textAlign: 'center', marginTop: 24 }}>
      <div style={{ fontSize: 22, fontWeight: 500 }}>{weather.city}</div>
      <div style={{ fontSize: 80, fontWeight: 200, margin: '8px 0' }}>{weather.temperature}</div>
      <div style={{ fontSize: 22, fontWeight: 400 }}>{weather.description}</div>
      <div style={{ fontSize: 16, margin: '8px 0 24px 0' }}>H:{weather.high}  L:{weather.low}</div>
    </div>
    <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 16, marginBottom: 24, width: '100%' }}>
      <div style={{ fontSize: 14, marginBottom: 8 }}>Sunny conditions will continue all day.</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        {weather.hourly?.map((h) => (
          <div key={h.time} style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: 13, marginBottom: 2 }}>{h.time}</div>
            <div style={{ fontSize: 22 }}>{h.icon}</div>
            <div style={{ fontSize: 15, marginTop: 2 }}>{h.temp}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 16, padding: 16, width: '100%' }}>
      <div style={{ fontSize: 14, marginBottom: 8, fontWeight: 500 }}>10-Day Forecast</div>
      {weather.forecast?.map((f) => (
        <div key={f.day} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ flex: 2, fontSize: 15 }}>{f.day}</div>
          <div style={{ flex: 1, fontSize: 18 }}>{f.icon}</div>
          <div style={{ flex: 2, textAlign: 'right', fontSize: 15, color: '#e3e3e3' }}>{f.low}</div>
          <div style={{ flex: 2, textAlign: 'right', fontSize: 15, color: 'white', fontWeight: 500 }}>{f.high}</div>
        </div>
      ))}
    </div>
  </div>
);

const More = () => {
  const [weatherList, setWeatherList] = useState<Weather[]>(initialWeather);
  const [form, setForm] = useState<Partial<Weather>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);

  // Pagination state
  const ROWS_PER_PAGE = 5;
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(weatherList.length / ROWS_PER_PAGE);
  const paginatedWeather = weatherList.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  // Auto-select first row on page load or page change
  useEffect(() => {
    if (paginatedWeather.length > 0) {
      setDetailId(paginatedWeather[0].id);
    } else {
      setDetailId(null);
    }
  }, [page, weatherList]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!form.city || !form.temperature || !form.description) return;
    setWeatherList([
      ...weatherList,
      {
        id: Date.now(),
        city: form.city,
        temperature: form.temperature,
        description: form.description,
        high: form.high || '',
        low: form.low || '',
      } as Weather,
    ]);
    setForm({});
  };

  const handleDelete = (id: number) => {
    setWeatherList(weatherList.filter((w) => w.id !== id));
    if (editingId === id) setEditingId(null);
    if (detailId === id) setDetailId(null);
  };

  const handleEdit = (weather: Weather) => {
    setEditingId(weather.id);
    setForm(weather);
  };

  const handleUpdate = () => {
    if (!form.city || !form.temperature || !form.description || editingId === null) return;
    setWeatherList(
      weatherList.map((w) =>
        w.id === editingId ? { ...w, ...form, id: editingId } : w
      )
    );
    setEditingId(null);
    setForm({});
  };

  const selectedWeather = detailId !== null ? weatherList.find((w) => w.id === detailId) : null;

  return (
    <div style={{
      display: 'flex',
      gap: 32,
      alignItems: 'flex-start',
      justifyContent: 'center',
      maxWidth: 1000,
      margin: '40px auto',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      <div style={{
        flex: 1,
        background: 'white',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        padding: 32,
        minWidth: 400,
      }}>
        <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 12, marginTop: 0, fontSize: 28, fontWeight: 700 }}>Weather Management</h2>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <input
            name="city"
            placeholder="City"
            value={form.city || ''}
            onChange={handleChange}
            style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          />
          <input
            name="temperature"
            placeholder="Temperature"
            value={form.temperature || ''}
            onChange={handleChange}
            style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <textarea
            name="description"

            value={form.description || ''}
            onChange={handleChange}
            style={{ width: '100%', minHeight: 56, padding: 0, borderRadius: 6, border: '1px solid #ccc', fontSize: 16, resize: 'vertical' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          {editingId === null ? (
            <button
              onClick={handleAdd}
              style={{
                flex: 1,
                background: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                padding: '10px 0',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              Add
            </button>
          ) : (
            <button
              onClick={handleUpdate}
              style={{
                flex: 1,
                background: '#43a047',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                padding: '10px 0',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              Update
            </button>
          )}
          {editingId !== null && (
            <button
              onClick={() => {
                setEditingId(null);
                setForm({});
              }}
              style={{
                flex: 1,
                background: '#e53935',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                padding: '10px 0',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              Cancel
            </button>
          )}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fafbfc', borderRadius: 8, overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#f1f3f4' }}>
              <th style={{ padding: 10, textAlign: 'left', color: '#1976d2' }}>City</th>
              <th style={{ padding: 10, textAlign: 'left', color: '#1976d2' }}>Temperature</th>
              <th style={{ padding: 10, textAlign: 'left', color: '#1976d2' }}>Description</th>
              <th style={{ padding: 10, textAlign: 'center', color: '#1976d2' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedWeather.map((w) => (
              <tr key={w.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 10 }}>{w.city}</td>
                <td style={{ padding: 10 }}>{w.temperature}</td>
                <td style={{ padding: 10 }}>{w.description}</td>
                <td style={{ padding: 10, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 8 }}>
                  <span
                    title="View"
                    onClick={() => setDetailId(w.id)}
                    style={{
                      background: detailId === w.id ? '#e3f2fd' : 'transparent',
                      borderRadius: '50%',
                      padding: 6,
                      cursor: 'pointer',
                      fontSize: 20,
                      border: detailId === w.id ? '2px solid #1976d2' : 'none',
                      transition: 'border 0.2s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </span>
                  <span
                    title="Edit"
                    onClick={() => handleEdit(w)}
                    style={{
                      background: '#fffde7',
                      borderRadius: '50%',
                      padding: 6,
                      cursor: 'pointer',
                      fontSize: 20,
                      border: '1px solid #ffb300',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </span>
                  <span
                    title="Delete"
                    onClick={() => handleDelete(w.id)}
                    style={{
                      background: '#ffebee',
                      borderRadius: '50%',
                      padding: 6,
                      cursor: 'pointer',
                      fontSize: 20,
                      border: '1px solid #e53935',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </span>
                </td>
              </tr>
            ))}
            {weatherList.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: 20, color: '#888' }}>
                  No weather data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, gap: 8 }}>
          <button onClick={() => setPage(page - 1)} disabled={page === 1} style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid #1976d2', background: page === 1 ? '#eee' : '#1976d2', color: page === 1 ? '#888' : 'white', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>Prev</button>
          {Array.from({ length: pageCount }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} style={{ padding: '6px 12px', borderRadius: 6, border: page === i + 1 ? '2px solid #1976d2' : '1px solid #ccc', background: page === i + 1 ? '#1976d2' : 'white', color: page === i + 1 ? 'white' : '#1976d2', fontWeight: 600, cursor: 'pointer' }}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(page + 1)} disabled={page === pageCount} style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid #1976d2', background: page === pageCount ? '#eee' : '#1976d2', color: page === pageCount ? '#888' : 'white', cursor: page === pageCount ? 'not-allowed' : 'pointer' }}>Next</button>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 320, maxWidth: 400 }}>
        {selectedWeather && (
          <WeatherDetail weather={selectedWeather} onClose={() => setDetailId(null)} />
        )}
      </div>
    </div>
  );
};

export default More;
