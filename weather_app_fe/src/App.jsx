import React, { useState } from "react";
import Login from "./components/Login";
import WeatherApp from "./components/WeatherApp";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("username") && localStorage.getItem("password")
  );

  return (
    <div>
      {isLoggedIn ? <WeatherApp /> : <Login setIsLoggedIn={setIsLoggedIn} />}
    </div>
  );
};

export default App;
