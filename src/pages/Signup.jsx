import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { signup } from '../actions/AuthActions';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignupSchema } from "../schemas/authSchema";

function Signup() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(SignupSchema),
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const onSubmit = async (data) => {
        setLoading(true);
        
        try {
            const response = await signup({
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: data.password,
            });

            if (response.message) {
                navigate('/auth/login');
            } else if (response.error) {
                setError(response.error);
            }
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="p-10 bg-white rounded-lg shadow-lg min-w-96">
                <h1 className="mb-4 text-xl font-bold text-center">Create Account</h1>
                {error && <p className="mb-4 text-center text-red-500">{error}</p>}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700">First Name</label>
                    <input
                        {...register("first_name")}
                        type="text"
                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none bg-slate-100 focus:outline focus:shadow-outline"
                    />
                    <p className="text-[red]">{errors.first_name?.message}</p>
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Last Name</label>
                    <input
                        {...register("last_name")}
                        type="text"
                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none bg-slate-100 focus:outline focus:shadow-outline"
                    />
                    <p className="text-[red]">{errors.last_name?.message}</p>
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Email</label>
                    <input
                        {...register("email")}
                        type="email"
                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none bg-slate-100 focus:outline focus:shadow-outline"
                    />
                    <p className="text-[red]">{errors.email?.message}</p>
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            {...register("password")}
                            type={showPassword ? 'text' : 'password'}
                            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none bg-slate-100 focus:outline focus:shadow-outline"
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
                    <p className="text-[red]">{errors.password?.message}</p>
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Confirm Password</label>
                    <div className="relative">
                        <input
                            {...register("confirm_password")}
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none bg-slate-100 focus:outline focus:shadow-outline"
                        />
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none"
                        >
                            {showConfirmPassword ? (
                                <i className="text-gray-600 fas fa-eye-slash hover:text-gray-800"></i>
                            ) : (
                                <i className="text-gray-600 fas fa-eye hover:text-gray-800"></i>
                            )}
                        </button>
                    </div>
                    <p className="text-[red]">{errors.confirm_password?.message}</p>
                </div>

                <div className="mb-6 text-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full px-4 py-2 font-bold text-white rounded-full focus:outline-none focus:shadow-outline ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </div>
                <div className="mt-4 text-center">
                    <NavLink to="/auth/login" className="text-blue-500 hover:text-blue-700">
                        Already have an account? Log In
                    </NavLink>
                </div>
            </form>
        </div>
    );
}

export default Signup;
