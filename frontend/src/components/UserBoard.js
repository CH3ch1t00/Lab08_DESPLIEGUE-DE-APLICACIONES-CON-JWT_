import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";

const UserBoard = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getUserBoard()
      .then((response) => {
        setContent(response.data);
      })
      .catch((error) => {
        const _content =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        setContent(_content);
      });
  }, []);

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto", textAlign: "center" }}>
      <h3>Panel de Usuario Protegido</h3>
      <div style={{ padding: "15px", border: "1px solid #ccc", marginTop: "10px" }}>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default UserBoard;