import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiDomain } from '../utils/apiDomain';

const URL = apiDomain + "auth/";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!email) {
            return alert("Please enter your email");
        }

        try {
            const OTP = Math.floor(Math.random() * 9000 + 1000);
            localStorage.setItem("email", JSON.stringify(email));
            localStorage.setItem("otp", JSON.stringify(OTP));
            // console.log(OTP);

            setOTP(OTP);

            await axios.post(`${URL}otp`, {
                OTP,
                recipient_email: email,
            });

            navigate("/auth/OTPInput");
        } catch (error) {
            console.error("Error occurred during sending otp:", error);
            alert("Sending OTP failed. Please try again later.");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="p-10 bg-white rounded-lg shadow-lg min-w-96">
                <h1 className="text-xl font-bold text-center mb-4">Forgot Password</h1>
                <p className="text-sm text-center text-gray-600 mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Email</label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 text-sm leading-tight text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6 text-center">
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                    >
                        Reset Password
                    </button>
                </div>
                <div className="text-center">
                    <NavLink to="/auth/login" className="text-blue-500 hover:text-blue-700">
                        Back to Login
                    </NavLink>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;




// import React, { useState } from 'react';
// import 'tailwindcss/tailwind.css';
// import { NavLink, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { apiDomain } from '../utils/apiDomain';
// const URL = apiDomain + "auth/";

// const ForgotPassword = () => {
//     const navigate = useNavigate();
//     const [email, setEmail] = useState('');
//     const [otp, setOTP] = useState();

//     const handleSubmit = (event) => {
//         event.preventDefault();
//         try {
//             if (email) {
//                 const OTP = Math.floor(Math.random() * 9000 + 1000);
//                 localStorage.setItem("email", JSON.stringify(email));
//                 localStorage.setItem("otp", JSON.stringify(otp));
//                 console.log(OTP);
//                 // console.log(email);
//                 setOTP(OTP);

//                 axios
//                     .post(`${URL}otp`, {
//                         OTP,
//                         recipient_email: email,
//                     })
//                     .catch(console.log);
//                 navigate("/auth/OTPInput");
//                 return;
//             }
//             return alert("Please enter your email");

//         } catch (error) {
//             console.error("Error occurred during sending otp:", error);
//             throw new Error("sending otp failed. Please try again later.");
//         }


//     };
//     // console.log(email)
//     return (
//         <>


//             <div className="flex items-center justify-center h-screen bg-gray-100">
//                 <form onSubmit={handleSubmit} className="p-10 bg-white rounded-lg shadow-lg min-w-96">
//                     <h1 className="text-xl font-bold text-center mb-4">Forgot Password</h1>
//                     <p className="text-sm text-center text-gray-600 mb-6">
//                         Enter your email address and we'll send you a link to reset your password.
//                     </p>
//                     <div className="mb-4">
//                         <label className="block mb-2 text-sm font-bold text-gray-700">Email</label>
//                         <input
//                             type="email"
//                             className="w-full px-3 py-2 text-sm leading-tight text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="mb-6 text-center">
//                         {/* <NavLink to='/auth/OTPInput'> */}
//                         <button
//                             type="submit"
//                             className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
//                         >
//                             Reset Password
//                         </button>
//                         {/* </NavLink> */}
//                     </div>
//                     <div className="text-center">
//                         <NavLink to="/auth/login" className="text-blue-500 hover:text-blue-700">
//                             Back to Login
//                         </NavLink>
//                     </div>
//                 </form>
//             </div>
//         </>
//     )
// }

// export default ForgotPassword