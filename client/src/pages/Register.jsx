import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useRegisterMutation } from "../redux/api/authApi";

const Register = () => {
  const navigate = useNavigate();
  const [registerApi, { isLoading, error }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    partyType: "SCHOOL",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    address: {
      line1: "",
      city: "",
      state: "",
      zip: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerApi(formData).unwrap();
      navigate("/login");
    } catch (err) {
      // error handled below
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          name="email"
          type="email"
          placeholder="Login Email"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <input
          name="name"
          placeholder="Organization Name"
          onChange={handleChange}
          required
        />

        <select name="partyType" onChange={handleChange}>
          <option value="SCHOOL">School</option>
          <option value="COMPANY">Company</option>
        </select>

        <input
          name="contactName"
          placeholder="Contact Name"
          onChange={handleChange}
        />

        <input
          name="contactPhone"
          placeholder="Contact Phone"
          onChange={handleChange}
        />

        <input
          name="contactEmail"
          placeholder="Contact Email"
          onChange={handleChange}
        />

        <input
          name="address.line1"
          placeholder="Address Line 1"
          onChange={handleChange}
        />

        <input
          name="address.city"
          placeholder="City"
          onChange={handleChange}
        />

        <input
          name="address.state"
          placeholder="State"
          onChange={handleChange}
        />

        <input
          name="address.zip"
          placeholder="ZIP Code"
          onChange={handleChange}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>

        {error && (
          <p className="error-text">
            {error.data?.message || "Registration failed"}
          </p>
        )}
      </form>

      <p>
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
