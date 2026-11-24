import { Field, Form, Formik } from "formik";
import { signInSchema } from "./signInSchema";
import Logo from "../../assets/Municipalidad_sin_fondo.png";
import { sweetAlert } from "../alerts/SweetAlert";
import PasswordInput from "../password/PasswordInput";
import { Button, Notice } from "../ui/ui";
import { FIELD_CLASS } from "../ui/styles";

/** Pantalla de ingreso. Siempre muestra un error genérico de credenciales. */
const LoginForm = ({
  sendSubmit,
  loading = false,
  error = null,
  onClearError,
}) => {
  const rememberedEmail = localStorage.getItem("rememberedEmail");

  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* Panel de marca */}
      <aside className="relative hidden overflow-hidden bg-night px-12 py-10 text-night-text lg:flex lg:flex-col">
        <div
          aria-hidden="true"
          className="login-grid pointer-events-none absolute inset-0"
        />
        <img
          src={Logo}
          alt="Municipalidad de Rosario"
          className="relative -ml-7 h-20 w-fit brightness-0 invert opacity-90"
        />
        <div className="relative mt-auto max-w-md">
          <p className="text-sm font-medium uppercase tracking-[0.12em] text-accent-bright">
            Parques y Paseos
          </p>
          <p className="mt-3 text-3xl font-semibold leading-tight text-white">
            SUA Webservices
          </p>
          <p className="mt-3 text-base leading-relaxed text-night-muted">
            Resolución y derivación masiva de solicitudes del Sistema Único de
            Atención, con seguimiento de cada lote.
          </p>
        </div>
        <p className="relative mt-10 text-xs text-night-muted">
          Centro de Informática Local
        </p>
      </aside>

      <div className="flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <img
            src={Logo}
            alt="Municipalidad de Rosario"
            className="-ml-4 mb-6 h-14 w-auto lg:hidden"
          />

          <h1 className="text-xl font-semibold text-ink">Ingresar</h1>
          <p className="mt-1 text-sm text-muted">
            Usá tu usuario y contraseña de SUA Webservices.
          </p>

          <Formik
            initialValues={{
              email: rememberedEmail || "",
              password: "",
              remember: !!rememberedEmail,
            }}
            validationSchema={signInSchema}
            onSubmit={(values, actions) => {
              const email = values.email.trim();
              if (values.remember)
                localStorage.setItem("rememberedEmail", email);
              else localStorage.removeItem("rememberedEmail");
              sendSubmit({ ...values, email }, actions);
            }}
          >
            {({ errors, touched, values, setFieldValue, handleChange }) => (
              <Form
                className="mt-6 space-y-4 rounded-lg border border-line bg-surface p-6 shadow-sm"
                noValidate
              >
                {error && <Notice>{error}</Notice>}

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="login-email"
                    className="text-sm font-medium text-ink"
                  >
                    Usuario
                  </label>
                  <Field
                    id="login-email"
                    name="email"
                    type="text"
                    inputMode="email"
                    autoComplete="username"
                    autoFocus={!values.email}
                    onChange={(e) => {
                      onClearError?.();
                      handleChange(e);
                    }}
                    placeholder="nombre@rosario.gob.ar"
                    aria-invalid={
                      !!(errors.email && touched.email) || undefined
                    }
                    className={`${FIELD_CLASS} ${errors.email && touched.email ? "!border-danger" : ""}`}
                  />
                  {errors.email && touched.email && (
                    <p className="text-xs text-danger">{errors.email}</p>
                  )}
                </div>

                <PasswordInput
                  label="Contraseña"
                  name="password"
                  value={values.password}
                  onChange={(e) => {
                    onClearError?.();
                    setFieldValue("password", e.target.value);
                  }}
                  autoComplete="current-password"
                  autoFocus={!!values.email}
                  invalid={!!(errors.password && touched.password)}
                  hint={touched.password ? errors.password : null}
                />

                <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-muted">
                  <Field
                    type="checkbox"
                    name="remember"
                    className="h-4 w-4 accent-accent"
                  />
                  Recordar usuario
                </label>

                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="w-full"
                >
                  {loading ? "Ingresando…" : "Ingresar"}
                </Button>
              </Form>
            )}
          </Formik>

          <button
            type="button"
            onClick={() =>
              sweetAlert.fire({
                type: "info",
                title: "¿Olvidaste tu contraseña?",
                message:
                  "Pedile el blanqueo al Centro de Informática Local o a un administrador del sistema.",
              })
            }
            className="mt-4 text-sm text-accent hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
