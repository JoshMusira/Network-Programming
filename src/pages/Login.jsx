import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import { NavLink, useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import { login } from '../actions/AuthActions';
import { useForm } from "react-hook-form";

function Login() {
    const { errors, dataFromServer } = useForm();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errEmail, setErrEmail] = useState("");
    const [errPassword, setErrPassword] = useState("");
    const [loading, setLoading] = useState(false); // Introduce loading state

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setErrEmail("");
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setErrPassword("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Set loading to true when form is submitted

        const schema = Yup.object().shape({
            email: Yup.string().email("Invalid email").required("Email is required"),
            password: Yup.string().required("Password is required"),
        });

        try {
            await schema.validate({ email, password }, { abortEarly: false });

            const userData = { email, password };
            const dataFromServer = await login(userData);

            if (dataFromServer.error) {
                setErrEmail(dataFromServer.error);
                setLoading(false);
            } else if (dataFromServer.token) {
                setLoading(false); // Set loading to false after successful login
                const { token } = dataFromServer;
                localStorage.setItem("user", JSON.stringify(token));
                const role = extractUserIdFromToken(token);
                localStorage.setItem("role", JSON.stringify(role));
                if (role === "admin") {
                    navigate("/wellcome-admin");
                } else {
                    navigate("/");
                }
            }
        } catch (validationErrors) {
            console.error('Validation errors:', validationErrors);

            if (validationErrors && validationErrors.inner) {
                validationErrors.inner.forEach((error) => {
                    if (error.path === "email") {
                        setErrEmail(error.message);
                    } else if (error.path === "password") {
                        setErrPassword(error.message);
                    }
                });
            } else {
                console.error('Validation error - inner is undefined or null');
            }
            if (!errors && !dataFromServer.error) {

                setLoading(false); // Set loading to false only if no errors
            }
        }
    };

    const extractUserIdFromToken = (token) => {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            throw new Error('Invalid token format');
        }
        const payload = JSON.parse(atob(tokenParts[1]));
        return payload.role;
    };

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex w-[100%] items-center justify-center h-screen bg-gray-200">
            <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md w-[90%] sm:w-[30%]">
                <h2 className="mb-6 text-2xl font-bold text-center">Login</h2>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none bg-slate-100 focus:outline focus:shadow-outline"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                    {errEmail && (
                        <p className="px-4 text-sm font-semibold text-red-500 font-titleFont">
                            {errEmail}
                        </p>
                    )}
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none bg-slate-100 focus:outline focus:shadow-outline"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none"
                        >
                            {showPassword ? (
                                <i className="text-gray-600 fas fa-eye-slash hover:text-gray-800"></i>
                            ) : (
                                <i className="text-gray-600 fas fa-eye hover:text-gray-800"></i>
                            )}
                        </button>
                    </div>
                    {errPassword && (
                        <p className="px-4 text-sm font-semibold text-red-500 font-titleFont">
                            {errPassword}
                        </p>
                    )}
                </div>
                <div className="mb-6 text-center">
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                        disabled={loading} // Disable button when loading
                    >
                        {loading ? 'Logging...' : 'Sign In'}
                    </button>
                </div>
                <div className="mt-4 text-center">
                    <NavLink to="/auth/signup" className="text-blue-500 hover:text-blue-700">
                        Don't have an account? Create Account
                    </NavLink>
                </div>
                <div className="mt-4 text-center">
                    <NavLink to="/auth/forgotPassword" className="text-black hover:text-blue-700">
                        Forgot Password?
                    </NavLink>
                </div>
            </form>
        </div>
    );

}

export default Login;