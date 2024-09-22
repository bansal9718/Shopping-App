import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <div>E-Commerce APP</div>
      <button>
        <Link to="/signup">Signup</Link>
      </button>

      <button>
        <Link to="/login">Login</Link>
      </button>
    </div>
  );
};

export default Dashboard;
