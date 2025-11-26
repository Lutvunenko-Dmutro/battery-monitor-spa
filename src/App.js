// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// --- Компонент Навігації ---
function Navigation() {
  const location = useLocation();
  return (
    <div className="sidebar">
      <h2>🤖 RoboBat <span style={{fontSize: '10px', color: '#e14eca'}}>PRO</span></h2>
      <nav>
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          📊 Дашборд
        </Link>
        <Link to="/history" className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}>
          📜 Логи (API)
        </Link>
        <Link to="/settings" className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}>
          ⚙️ Система
        </Link>
      </nav>
    </div>
  );
}

// --- Компонент: Графік ---
const BatteryChart = ({ data }) => (
  <div style={{ width: '100%', height: 250, marginTop: '20px' }}>
    <ResponsiveContainer>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="time" stroke="#888" />
        <YAxis domain={[0, 100]} stroke="#888" />
        <Tooltip 
          contentStyle={{ backgroundColor: '#333', border: 'none' }}
          itemStyle={{ color: '#fff' }}
        />
        <Line 
          type="monotone" 
          dataKey="level" 
          stroke="#e14eca" 
          strokeWidth={3} 
          dot={false} 
          animationDuration={300}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// --- Сторінка Моніторингу (Dashboard) ---
function Dashboard({ batteryData, historyData }) {
  const getColor = (level) => {
    if (level > 60) return '#42b883';
    if (level > 20) return '#f1c40f';
    return '#e74c3c';
  };

  // Логіка прогнозування (Time to Empty)
  // Припускаємо, що втрачаємо 0.5% за секунду (це 30% за хвилину для демо)
  const calculateTimeLeft = () => {
    const secondsLeft = batteryData.level / 0.5;
    const mins = Math.floor(secondsLeft / 60);
    const secs = Math.floor(secondsLeft % 60);
    return `${mins} хв ${secs} с`;
  };

  return (
    <div className="card fade-in">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1>Стан системи</h1>
        <div className="prediction-badge">
          ⏳ До розряду: {calculateTimeLeft()}
        </div>
      </div>
      
      <div className="battery-container">
        <div 
          className="battery-level" 
          style={{ 
            width: `${batteryData.level}%`, 
            backgroundColor: getColor(batteryData.level),
            boxShadow: `0 0 15px ${getColor(batteryData.level)}`
          }}
        >
          {batteryData.level.toFixed(1)}%
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <h3>Напруга</h3>
          <p className="stat-value" style={{color: '#00d2ff'}}>{batteryData.voltage} V</p>
        </div>
        <div className="stat-box">
          <h3>Температура</h3>
          <p className="stat-value" style={{color: batteryData.temp > 40 ? '#e74c3c' : 'inherit'}}>
            {batteryData.temp}°C
          </p>
        </div>
        <div className="stat-box">
          <h3>Статус</h3>
          <p className="stat-value" style={{fontSize: '16px'}}>{batteryData.status}</p>
        </div>
      </div>

      <h3 style={{marginTop: '30px'}}>Динаміка розряду (Real-time)</h3>
      <BatteryChart data={historyData} />
    </div>
  );
}

// --- Сторінка Історії (API) ---
function History() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => {
        const fakeLogs = data.slice(0, 6).map((user, index) => ({
          time: new Date(Date.now() - index * 600000).toLocaleTimeString().slice(0,5),
          event: `Діагностика модуля ${user.address.suite}`,
          user: user.username,
          status: index % 2 === 0 ? 'OK' : 'Warning'
        }));
        setLogs(fakeLogs);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="card fade-in">
      <h1>Журнал подій (Server API)</h1>
      {loading ? <p>Отримання даних...</p> : (
        <table className="custom-table">
          <thead>
            <tr>
              <th>Час</th>
              <th>Подія</th>
              <th>Оператор</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.time}</td>
                <td>{log.event}</td>
                <td>{log.user}</td>
                <td>
                  <span className={`status-badge ${log.status === 'OK' ? 'green' : 'orange'}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// --- Налаштування + Тема ---
function Settings({ threshold, setThreshold, onRecharge, isDark, toggleTheme }) {
  const [localThreshold, setLocalThreshold] = useState(threshold);

  const handleSubmit = (e) => {
    e.preventDefault();
    setThreshold(localThreshold);
    toast.success(`Поріг оновлено: ${localThreshold}%`);
  };

  return (
    <div className="card fade-in">
      <h1>Керування системою</h1>
      
      <div className="settings-section">
        <h3>🎨 Зовнішній вигляд</h3>
        <button className="btn outline" onClick={toggleTheme}>
          {isDark ? '☀️ Увімкнути світлу тему' : '🌙 Увімкнути темну тему'}
        </button>
      </div>

      <div className="settings-section">
        <h3>⚠️ Параметри безпеки</h3>
        <form onSubmit={handleSubmit} style={{display: 'flex', gap: '10px'}}>
          <input 
            type="number" 
            value={localThreshold} 
            onChange={(e) => setLocalThreshold(e.target.value)} 
            className="input-field"
          />
          <button type="submit" className="btn">Зберегти</button>
        </form>
      </div>

      <div className="settings-section">
        <h3>⚡ Аварійне живлення</h3>
        <button className="btn danger" onClick={onRecharge}>
          ПОВНИЙ ПЕРЕЗАРЯД
        </button>
      </div>
    </div>
  );
}

// --- Головний компонент ---
function App() {
  const [isDark, setIsDark] = useState(true);
  const [batteryData, setBatteryData] = useState({
    level: 100, voltage: 12.6, temp: 35, status: 'Active'
  });
  const [historyData, setHistoryData] = useState([]);
  const [lowBatThreshold, setLowBatThreshold] = useState(20);

  // Ефект таймера (серце програми)
  useEffect(() => {
    const timer = setInterval(() => {
      setBatteryData(prev => {
        let newLevel = prev.level - 0.5;
        if (newLevel <= 0) newLevel = 0;
        
        // Сповіщення про низький заряд (один раз)
        if (newLevel === lowBatThreshold) {
          toast.warn(`Увага! Заряд нижче ${lowBatThreshold}%!`);
        }
        if (newLevel === 0 && prev.level > 0) {
          toast.error("Критична зупинка! Батарея розряджена.");
        }

        const newVolts = (10 + (newLevel / 100) * 2.6).toFixed(2);
        
        // Оновлюємо графік
        setHistoryData(currentHistory => {
          const newPoint = { 
            time: new Date().toLocaleTimeString('uk-UA').slice(0, 8), 
            level: parseFloat(newLevel.toFixed(1)) 
          };
          // Тримаємо тільки останні 20 точок
          const updated = [...currentHistory, newPoint];
          return updated.slice(-20);
        });

        return {
          level: newLevel,
          voltage: newVolts,
          temp: parseFloat((prev.temp + (Math.random() - 0.5)).toFixed(1)),
          status: newLevel < lowBatThreshold ? '⚠️ LOW BATTERY' : 'Active'
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lowBatThreshold]);

  const rechargeBattery = () => {
    setBatteryData(prev => ({ ...prev, level: 100, status: 'Charging...' }));
    toast.success("Батарею повністю заряджено! 🔋");
  };

  return (
    <div className={isDark ? 'app-wrapper dark-mode' : 'app-wrapper light-mode'}>
      <Router>
        <div className="app-container">
          <Navigation />
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard batteryData={batteryData} historyData={historyData} />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={
                <Settings 
                  threshold={lowBatThreshold} 
                  setThreshold={setLowBatThreshold}
                  onRecharge={rechargeBattery}
                  isDark={isDark}
                  toggleTheme={() => setIsDark(!isDark)}
                />
              } />
            </Routes>
          </div>
        </div>
      </Router>
      <ToastContainer position="bottom-right" theme={isDark ? "dark" : "light"} />
    </div>
  );
}

export default App;