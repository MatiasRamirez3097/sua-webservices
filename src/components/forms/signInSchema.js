import * as Yup from "yup";

// En el login solo verificamos que los campos no estén vacíos.
// La política de contraseñas (largo, caracteres especiales, etc.) se valida
// únicamente al crear / blanquear / cambiar la contraseña.
export const signInSchema = Yup.object().shape({
    email: Yup.string().trim().required("Ingresá tu usuario"),
    password: Yup.string().required("Ingresá tu contraseña"),
});
