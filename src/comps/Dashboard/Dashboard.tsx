"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const Dashboard = () => {
  const search = useSearchParams();
  const authorization_code = search.get("code");

  const getToken = async () => {
    if (!authorization_code) return;

    try {
      const response = await axios.post("/api/token", {
        code: authorization_code,
      });

      const { access_token, id_token } = response.data;

      // Store tokens in sessionStorage/localStorage
      sessionStorage.setItem("accessToken", access_token);
      sessionStorage.setItem("idToken", id_token);

      console.log("Tokens:", response.data);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    }
  };

  return (
    <div>
      Dashboard
      <button onClick={() => getToken()}>GET ME STUFF</button>
    </div>
  );
};

export default Dashboard;
