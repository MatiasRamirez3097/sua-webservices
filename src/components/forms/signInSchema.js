import * as Yup from "yup";

export const signInFields = [
    { name: "email", label: "Email", type: "text", value: "" },
    { name: "password", label: "Password", type: "password", value: "" },
];

export const signInSchema = Yup.object().shape({
    email: Yup.string().email("Invalid Email!").required("Required"),
    password: Yup.string()
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,16}$)/,
            "Must Contain between 8 and 16 characters , One Uppercase, One Lowercase, One Number and One Special Case Character"
        )
        .required("Required"),
});
