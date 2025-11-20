import { Form, Formik } from "formik";
import { Input, Label } from "..";
import { signInSchema } from "./signInSchema";

const LoginForm = () => {
    return (
        <Formik
            validationSchema={signInSchema}
            onSubmit={(values, actions) => {
                sendSubmit(values, actions);
            }}
        >
            <Form>
                <Label label="hola" />

                <Label label="hola" />
                <Input name="hola" type="text" placeholder="asd" />
                <Label label="hola" />
                <Input name="hola" type="text" placeholder="ad" />
                <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                    Enviar
                </button>
                <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                    Cancelar
                </button>
            </Form>
        </Formik>
    );
};

export default LoginForm;
