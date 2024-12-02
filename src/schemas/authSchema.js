import * as yup from "yup";

export const SignupSchema = yup.object().shape({
    first_name: yup.string().required("First name is required!"),
    last_name: yup.string().required("Last name is required!"),
    email: yup.string().email("Email must contain @ symbol!").required("Email is required!"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters long!") // Increased minimum length
        .max(15)
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!"
        )
        .notOneOf(["password", "123456", "qwerty"], "Avoid common passwords!")
        .required("Password cannot be empty!"),
        confirm_password: yup.string().oneOf([yup.ref("password")], "Passwords must match!"),
  
});