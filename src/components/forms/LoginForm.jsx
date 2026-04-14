import { Field, Form, Formik } from "formik";
import { Button } from "..";
import { signInSchema } from "./signInSchema";
import Logo from "../../assets/Municipalidad_sin_fondo.png";
import { sweetAlert } from "../alerts/SweetAlert";

const LoginForm = ({ sendSubmit }) => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");

    return (
        <Formik
            initialValues={{
                email: rememberedEmail || "",
                password: "",
                remember: !!rememberedEmail,
            }}
            validationSchema={signInSchema}
            onSubmit={(values, actions) => {
                if (values.remember) {
                    localStorage.setItem("rememberedEmail", values.email);
                } else {
                    localStorage.removeItem("rememberedEmail");
                }
                sendSubmit(values, actions);
            }}
        >
            {({ errors, touched }) => (
                <Form className="space-y-5">
                    {/* Logo + Título */}
                    <div className="flex flex-col items-center gap-3 mb-2">
                        <img
                            src={Logo}
                            alt="Municipalidad de Rosario"
                            className="h-20 w-auto object-contain"
                        />
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-white tracking-widest uppercase">
                                SUA Webservices
                            </h1>
                            <p className="text-gray-400 text-sm mt-1">
                                Dirección General de Parques y Paseos
                            </p>
                        </div>
                    </div>

                    {/* Separador */}
                    <div className="border-t border-gray-700 pt-5">
                        <p className="text-gray-400 text-xs uppercase tracking-widest text-center mb-5">
                            Iniciar sesión
                        </p>

                        {/* Email */}
                        <div className="space-y-1 mb-4">
                            <label className="text-gray-400 text-sm font-medium">
                                Usuario
                            </label>
                            <div className="relative">
                                {/* Ícono */}
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                        />
                                    </svg>
                                </span>
                                <Field
                                    name="email"
                                    type="text"
                                    placeholder="usuario@rosario.gob.ar"
                                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                            </div>
                            {errors.email && touched.email && (
                                <p className="text-red-400 text-xs mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Contraseña */}
                        <div className="space-y-1 mb-4">
                            <label className="text-gray-400 text-sm font-medium">
                                Contraseña
                            </label>
                            <div className="relative">
                                {/* Ícono */}
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </span>
                                <Field
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                            </div>
                            {errors.password && touched.password && (
                                <p className="text-red-400 text-xs mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Recordarme */}
                        <div className="flex items-center justify-between text-sm mb-5">
                            <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-300 transition-colors">
                                <Field
                                    type="checkbox"
                                    name="remember"
                                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 accent-indigo-500"
                                />
                                <span className="text-xs">Recordarme</span>
                            </label>

                            <span
                                onClick={() =>
                                    sweetAlert.fire({
                                        type: "info",
                                        title: "¿Olvidaste tu contraseña?",
                                        message:
                                            "Contactate con el Centro de Informática Local para restablecer tu contraseña.",
                                    })
                                }
                                className="text-indigo-400 hover:text-indigo-300 text-xs cursor-pointer transition-colors"
                            >
                                ¿Olvidaste tu contraseña?
                            </span>
                        </div>

                        {/* Botón */}
                        <button
                            type="submit"
                            className="w-full py-2.5 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200 shadow-lg tracking-wide"
                        >
                            Iniciar sesión
                        </button>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-gray-600 text-xs pt-2">
                        Centro de Informática Local — Municipalidad de Rosario
                    </p>
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;
