import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WeatherApp.css";

const WeatherApp = () => {
  const [weatherEntries, setWeatherEntries] = useState([]);
  const [weatherData, setWeatherData] = useState("");
  const [temperature, setTemperature] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const authHeaders = {
    headers: {
      username: localStorage.getItem("username"),
      password: localStorage.getItem("password"),
    },
  };

  useEffect(() => {
    axios.get(`${API_URL}/api/weather`, authHeaders).then((response) => {
      setWeatherEntries(response.data);
    });
  }, []);

  const handleAddEntry = () => {
    const newEntry = {
      data: weatherData,
      temperature: temperature,
      timestamp: new Date().toLocaleString(),
    };

    axios
      .post(`${API_URL}/api/weather`, newEntry, authHeaders)
      .then((response) => {
        setWeatherEntries([response.data, ...weatherEntries]);
        setWeatherData("");
        setTemperature("");
      });
  };

  const handleDeleteEntry = (id) => {
    axios.delete(`${API_URL}/api/weather/${id}`, authHeaders).then(() => {
      setWeatherEntries(weatherEntries.filter((entry) => entry._id !== id));
    });
  };

  return (
    <div className="container">
      <h1>Dědovo počasí</h1>
      <div className="input-container">
        <input
          type="text"
          value={weatherData}
          onChange={(e) => setWeatherData(e.target.value)}
          placeholder="Vlož informace o počasí"
        />
        <input
          type="text"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
          placeholder="Vlož teplotu"
        />
        <button onClick={handleAddEntry}>Přidat</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Datum a čas</th>
            <th>Popis</th>
            <th>Teplota</th>
            <th>Akce</th>
          </tr>
        </thead>
        <tbody>
          {weatherEntries.map((entry) => (
            <tr key={entry._id}>
              <td>{entry.timestamp}</td>
              <td>{entry.data}</td>
              <td>{entry.temperature}</td>
              <td>
                <button
                  className="delete"
                  onClick={() => handleDeleteEntry(entry._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeatherApp;
