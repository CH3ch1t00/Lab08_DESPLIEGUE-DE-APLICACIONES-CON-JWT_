import React, { useState, useEffect } from "react";
import AuthService from "./services/auth.service";
import Login from "./components/Login";
import UserBoard from "./components/UserBoard";

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };

  return (
    <div>
      <nav style={{ padding: "10px", background: "#f0f0f0", display: "flex", justifyContent: "space-between" }}>
        <span><strong>Lab JWT React</strong></span>
        <div>
          {currentUser ? (
            <div>
              <span style={{ marginRight: "10px" }}>Hola, {currentUser.username}</span>
              <button onClick={logOut}>Cerrar Sesión</button>
            </div>
          ) : (
            <span>Debes iniciar sesión</span>
          )}
        </div>
      </nav>

      <div style={{ padding: "20px" }}>
        {!currentUser ? (
          <Login />
        ) : (
          <div>
            <UserBoard />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;