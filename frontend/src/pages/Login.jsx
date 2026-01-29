import { useState, useContext } from "react";
import { FaUser } from "react-icons/fa";
import Input from "../components/Input";
import Button from "../components/Button";
import PasswordInput from "../components/PasswordInput";
import { AppContext } from "../context/AppContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AppContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleLogin}
          className="w-[90%] max-w-100 mx-auto flex flex-col rounded-xl shadow-lg p-6 bg-white"
        >
          <h2 className="text-2xl text-gray-900 font-bold text-center mb-1">
            Login
          </h2>
          <p className="text-center text-gray-600 mb-4 text-sm">
            Welcome back! Please login to your account
          </p>

          {/* Email */}
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            icon={<FaUser />}
            required
            className="mb-4"
          />

          {/* Password */}
          <PasswordInput
            label="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          {/* Login Button */}
          <Button
            type="submit"
            text="Login"
            loading={loading}
            loaderText="Logging in..."
            disabled={loading}
            className="mt-4"
          />
        </form>
      </div>
    </div>
  );
}
