import { Field, Form, Formik } from "formik";
import { Button, H2, Input, Label, Div } from "..";
import { signInSchema } from "./signInSchema";

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
                <Form className="space-y-6">
                    <H2 label="INICIAR SESIÓN" />

                    {/* Usuario */}
                    <div className="space-y-2">
                        <Label label="Usuario" />
                        <Field
                            as={Input}
                            name="email"
                            type="text"
                            placeholder="Ingrese su usuario..."
                            className="w-full px-4 py-4 text-lg rounded-xl bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.email && touched.email && (
                            <div className="text-red-400 text-sm">
                                {errors.email}
                            </div>
                        )}
                    </div>

                    {/* Contraseña */}
                    <div className="space-y-2">
                        <Label label="Contraseña" />
                        <Field
                            as={Input}
                            name="password"
                            type="password"
                            placeholder="Ingrese su contraseña..."
                            className="w-full px-4 py-4 text-lg rounded-xl bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.password && touched.password && (
                            <div className="text-red-400 text-sm">
                                {errors.password}
                            </div>
                        )}
                    </div>

                    {/* Recordar usuario */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <Field
                                type="checkbox"
                                name="remember"
                                className="w-4 h-4 rounded border-gray-600 bg-gray-800 focus:ring-blue-500"
                            />
                            Recordarme
                        </label>

                        <a href="#" className="text-blue-400 hover:underline">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    {/* Botón principal */}
                    <Button
                        type="submit"
                        className="w-full py-4 text-lg font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg"
                        text="Iniciar sesión"
                    />
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;
