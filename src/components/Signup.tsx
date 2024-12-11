import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { AuthService } from "../authService";
import { setUser, setError } from "../authSlice";
import { RootState } from "../store";

export const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await AuthService.signup(email, password);
      dispatch(setUser(user));
      navigate("/dashboard");
    } catch (error) {
      dispatch(setError("Signup failed. Please try again."));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
};