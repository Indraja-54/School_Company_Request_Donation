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
    } catch (err) {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 transition hover:shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Register your organization to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Password */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Organization */}
          <input
            name="name"
            placeholder="Organization Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Party Type */}
          <select
            name="partyType"
            onChange={handleChange}
            className="w-full px-4 py-2.5 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="SCHOOL">School</option>
            <option value="COMPANY">Company</option>
          </select>

          {/* Contact */}
          <input
            name="contactName"
            placeholder="Contact Person"
            onChange={handleChange}
            className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            name="contactPhone"
            placeholder="Contact Phone"
            onChange={handleChange}
            className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            name="contactEmail"
            placeholder="Contact Email"
            onChange={handleChange}
            className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Address */}
          <input
            name="address.line1"
            placeholder="Address Line"
            onChange={handleChange}
            className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="grid grid-cols-3 gap-3">
            <input
              name="address.city"
              placeholder="City"
              onChange={handleChange}
              className="px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="address.state"
              placeholder="State"
              onChange={handleChange}
              className="px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="address.zip"
              placeholder="ZIP"
              onChange={handleChange}
              className="px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isLoading ? "Registering..." : "Create Account"}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center">
              {error.data?.message || "Registration failed"}
            </p>
          )}
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
