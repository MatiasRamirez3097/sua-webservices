import { Form, Formik } from "formik";
import { Button, H2, Input, Label, Div } from "..";
import { signInSchema } from "./signInSchema";

const LoginForm = () => {
    return (
        <Formik
            validationSchema={signInSchema}
            onSubmit={(values, actions) => {
                sendSubmit(values, actions);
            }}
        >
            <Form className="bg-gray-800 p-10 rounded-xl shadow-lg w-full max-w-lg mx-auto">
                <H2 label="INICIAR SESION"/>
                <Div>
                    <Label label="Ingrese el usuario" />
                    <Input name="usuarioingreso" type="text" placeholder="Ingrese aqui su ususario..." />
                </Div>
                <Div>
                    <Label label="Ingrese la contraseña" />
                    <Input name="password" type="password" placeholder="Ingrese aqui su contraseña..." />
                </Div>
                <div className="flex justify-center gap-4 mt-4">
                    <Button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        text={"Aceptar"}
                    >
                    </Button>
                    <Button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        text={"Cancelar"}
                    >
                    </Button>
                </div>
            </Form>
        </Formik>
        
    );
};

export default LoginForm;
