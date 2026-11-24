/**
 * Piezas visuales compartidas. Todas las pantallas se arman con estas para
 * mantener un único lenguaje: encabezado oscuro con acento violeta, tarjetas
 * claras con bordes finos y movimiento sutil (entradas escalonadas, hover,
 * indicadores que se deslizan). Todo respeta prefers-reduced-motion.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cx } from "./styles";

// ─── Botones ──────────────────────────────────────────────────────────────────
const BUTTON_VARIANTS = {
    primary:
        "bg-accent text-white border-accent hover:bg-accent-hover hover:border-accent-hover shadow-[0_1px_0_rgb(255_255_255/0.15)_inset,0_6px_16px_-8px_rgb(90_70_212/0.8)]",
    secondary: "bg-surface text-ink border-line-strong hover:bg-subtle hover:border-accent-line",
    danger: "bg-surface text-danger border-line-strong hover:bg-danger-soft hover:border-danger",
    "danger-solid": "bg-danger-strong text-white border-danger-strong hover:bg-danger-hover hover:border-danger-hover",
    ghost: "bg-transparent text-muted border-transparent hover:bg-subtle hover:text-ink",
    // Para usar sobre el encabezado oscuro
    "on-dark": "bg-white/8 text-night-text border-white/15 hover:bg-white/15 hover:text-white",
};

const BUTTON_SIZES = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
};

export const Button = ({
    variant = "secondary",
    size = "md",
    className,
    type = "button",
    loading = false,
    children,
    disabled,
    ...rest
}) => (
    <button
        type={type}
        disabled={disabled || loading}
        className={cx(
            "inline-flex items-center justify-center gap-2 rounded-md border font-medium whitespace-nowrap",
            "transition-[background-color,border-color,color,transform,box-shadow] duration-150 active:scale-[0.98]",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:active:scale-100",
            BUTTON_VARIANTS[variant],
            BUTTON_SIZES[size],
            className,
        )}
        {...rest}
    >
        {loading && <Spinner className="h-3.5 w-3.5" />}
        {children}
    </button>
);

export const Spinner = ({ className = "h-4 w-4" }) => (
    <span
        aria-hidden="true"
        className={cx("inline-block animate-spin rounded-full border-2 border-current border-t-transparent", className)}
    />
);

// ─── Estructura de página ─────────────────────────────────────────────────────
/**
 * Página con encabezado oscuro (título, descripción, acciones) y un espacio
 * opcional `hero` debajo del título para pestañas, filtros o indicadores.
 */
export const Page = ({ title, description, actions, hero, children }) => (
    <>
        <section className="relative overflow-hidden border-b border-night-line bg-night text-night-text">
            <div aria-hidden="true" className="hero-texture pointer-events-none absolute inset-0" />
            <div aria-hidden="true" className="hero-glow pointer-events-none" />
            <div aria-hidden="true" className="hero-glow second pointer-events-none" />
            <div className="relative mx-auto max-w-6xl px-4 pt-10 sm:px-6">
                <div className="flex flex-wrap items-end justify-between gap-4 pb-7">
                    <div className="anim-rise min-w-0">
                        <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
                        {description && <p className="mt-1.5 text-base text-night-muted">{description}</p>}
                    </div>
                    {actions && (
                        <div className="anim-rise flex flex-wrap gap-2" style={{ "--i": 2 }}>
                            {actions}
                        </div>
                    )}
                </div>
                {hero && (
                    <div className="anim-rise pb-7" style={{ "--i": 1 }}>
                        {hero}
                    </div>
                )}
            </div>
        </section>
        <div className="mx-auto w-full max-w-6xl px-4 py-10 text-left sm:px-6">{children}</div>
    </>
);

/** Bloque con borde. `title` opcional arriba a la izquierda. */
export const Section = ({ title, description, children, className, aside }) => (
    <section className={cx("rounded-lg border border-line bg-surface", className)}>
        {title && (
            <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-3">
                <div>
                    <h2 className="text-sm font-semibold text-ink">{title}</h2>
                    {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
                </div>
                {aside}
            </div>
        )}
        <div className="px-5 py-4">{children}</div>
    </section>
);

// ─── Pestañas con indicador deslizante ────────────────────────────────────────
/**
 * tabs: [{ value, label, count? }]. `dark` para usarlas sobre el encabezado.
 * El indicador se mueve hasta la pestaña activa en lugar de saltar.
 */
export const Tabs = ({ tabs, value, onChange, dark = false, label }) => {
    const refs = useRef({});
    const [bar, setBar] = useState({ left: 0, width: 0, ready: false });

    useLayoutEffect(() => {
        const el = refs.current[value];
        if (el) setBar({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
    }, [value, tabs]);

    return (
        <div
            role="tablist"
            aria-label={label}
            className={cx("relative flex gap-1 overflow-x-auto", dark ? "" : "border-b border-line")}
        >
            {tabs.map((t) => {
                const active = t.value === value;
                return (
                    <button
                        key={t.value}
                        ref={(el) => (refs.current[t.value] = el)}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => onChange(t.value)}
                        className={cx(
                            "relative whitespace-nowrap rounded-md px-3 pb-2.5 pt-1.5 text-sm transition-colors",
                            dark
                                ? active
                                    ? "font-medium text-white"
                                    : "text-night-muted hover:text-night-text"
                                : active
                                  ? "font-medium text-ink"
                                  : "text-muted hover:text-ink",
                        )}
                    >
                        {t.label}
                        {t.count !== undefined && (
                            <span
                                className={cx(
                                    "ml-2 rounded-full px-1.5 py-px text-xs tabular transition-colors",
                                    dark
                                        ? active
                                            ? "bg-accent text-white"
                                            : "bg-white/8 text-night-muted"
                                        : active
                                          ? "bg-accent-soft text-accent"
                                          : "bg-subtle text-muted",
                                )}
                            >
                                {t.count}
                            </span>
                        )}
                    </button>
                );
            })}
            <span
                aria-hidden="true"
                className={cx(
                    "absolute bottom-0 h-0.5 rounded-full transition-[left,width] duration-300 ease-out",
                    dark ? "bg-accent-bright" : "bg-accent",
                    bar.ready ? "opacity-100" : "opacity-0",
                )}
                style={{ left: bar.left + 12, width: Math.max(bar.width - 24, 0) }}
            />
        </div>
    );
};

// ─── Números que cuentan hasta su valor ───────────────────────────────────────
export const CountUp = ({ value = 0, duration = 700 }) => {
    const [shown, setShown] = useState(0);
    const from = useRef(0);

    useEffect(() => {
        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        const start = from.current;
        if (reduce || start === value) {
            from.current = value;
            setShown(value);
            return;
        }
        let raf;
        const t0 = performance.now();
        const tick = (t) => {
            const p = Math.min((t - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setShown(Math.round(start + (value - start) * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
            else from.current = value;
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [value, duration]);

    return <span className="tabular">{shown}</span>;
};

// ─── Estados ──────────────────────────────────────────────────────────────────
const TONES = {
    neutral: "text-muted",
    accent: "text-accent",
    ok: "text-ok",
    warn: "text-warn",
    danger: "text-danger",
};

/** Estado como texto con un punto de color. `live` hace latir el punto. */
export const Status = ({ tone = "neutral", live = false, children }) => (
    <span className={cx("inline-flex items-center gap-1.5 text-sm font-medium", TONES[tone])}>
        <span aria-hidden="true" className={cx("h-1.5 w-1.5 rounded-full bg-current", live && "live-dot")} />
        {children}
    </span>
);

export const Notice = ({ tone = "danger", children, className }) => {
    const styles = {
        danger: "border-danger/30 bg-danger-soft text-danger",
        warn: "border-warn/30 bg-warn-soft text-warn",
        info: "border-accent/25 bg-accent-soft text-accent",
        ok: "border-ok/30 bg-ok-soft text-ok",
    };
    return (
        <div
            role={tone === "danger" ? "alert" : "status"}
            className={cx("anim-fade rounded-md border px-3 py-2 text-sm", styles[tone], className)}
        >
            {children}
        </div>
    );
};

export const EmptyState = ({ children }) => (
    <div className="anim-fade rounded-lg border border-dashed border-line-strong bg-surface px-4 py-10 text-center text-sm text-muted">
        {children}
    </div>
);

// ─── Formularios ──────────────────────────────────────────────────────────────
export const Field = ({ label, htmlFor, required, hint, error, children, className }) => (
    <div className={cx("flex flex-col gap-1", className)}>
        {label && (
            <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
                {label}
                {required && <span className="ml-0.5 text-danger">*</span>}
            </label>
        )}
        {children}
        {error ? <p className="text-xs text-danger">{error}</p> : hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
);

// ─── Diálogo modal ────────────────────────────────────────────────────────────
/**
 * Modal accesible: cierra con Escape o clic afuera (salvo `busy`) y bloquea
 * el scroll de la página. `as="form"` + `onSubmit` para formularios.
 */
export const Dialog = ({
    title,
    description,
    onClose,
    busy = false,
    width = "max-w-md",
    as: Tag = "div",
    onSubmit,
    footer,
    children,
}) => {
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && !busy && onClose();
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose, busy]);

    return (
        <div
            className="anim-fade fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-night/55 p-4 backdrop-blur-[2px] sm:pt-[8vh]"
            onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
        >
            <Tag
                onSubmit={onSubmit}
                noValidate={Tag === "form" ? true : undefined}
                className={cx(
                    "anim-pop w-full overflow-hidden rounded-lg border border-line bg-surface text-left shadow-[0_24px_60px_-20px_rgb(24_23_43/0.55)]",
                    width,
                )}
            >
                <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
                    <div className="flex items-start gap-3">
                        <span aria-hidden="true" className="mt-1 h-4 w-1 rounded-full bg-accent" />
                        <div>
                            <h2 id="dialog-title" className="text-base font-semibold text-ink">
                                {title}
                            </h2>
                            {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={busy}
                        aria-label="Cerrar"
                        className="-mr-1 rounded p-1 text-faint transition-colors hover:bg-subtle hover:text-ink"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="px-5 py-4">{children}</div>
                {footer && <div className="flex justify-end gap-2 border-t border-line bg-subtle px-5 py-3">{footer}</div>}
            </Tag>
        </div>
    );
};
