export const cx = (...c) => c.filter(Boolean).join(" ");

export const FIELD_CLASS =
    "block w-full h-10 rounded-md border border-line-strong bg-surface px-3 text-sm text-ink " +
    "placeholder:text-faint transition-colors focus:outline-none focus:border-accent " +
    "focus:ring-1 focus:ring-accent disabled:bg-subtle disabled:text-faint";

/** Props para la animación de entrada escalonada (ver .anim-rise en index.css). */
export const rise = (i = 0, extra = "") => ({
    className: cx("anim-rise", extra),
    style: { "--i": Math.min(i, 14) },
});
