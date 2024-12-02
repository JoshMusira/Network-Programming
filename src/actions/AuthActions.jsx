import { apiDomain } from "../utils/apiDomain";
import axios from 'axios';

const BASE_API_URL = 'http://localhost:8000/users';

export const getLoggedInUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user;
};

// Signup endpoint
export const signup = async (data) => {
    const response = await fetch(`${BASE_API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const responseData = await response.json();
      // console.log(responseData.message); // Access the message from the backend
      return responseData;
    } else {
      throw new Error('Something went wrong from the server. Please try again later');
    }
  };

// export const signup = async (formData) => {
//     try {
//         const { first_name, last_name, email, password} = formData;
//         console.log(first_name, last_name, email, password)
//         const response = await axios.post(`${URL}signup`, {first_name, last_name, email, password }, {
//             headers: {
//                 "Content-Type": "application/json",
//             }
//         });

//         if (response.status !== 200) {
//             throw new Error("Network response was not ok!");
//         }

//         return response.data;
//     } catch (error) {
//         console.error("Error occurred during signup:", error);
//         throw new Error("Signup failed. Please try again later.");
//     }
// };




export const login = async (user) => {
    // console.log(user)
    try {
        const response = await axios.post(`${URL}login`, user, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status !== 200) {
            throw new Error('Network response was not ok!');
        }

        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};