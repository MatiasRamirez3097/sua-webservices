// Política de contraseñas: se valida al CREAR, BLANQUEAR o CAMBIAR una contraseña.
// En el login NO se valida el formato: solo se muestra un error genérico.
// Mantener sincronizado con: sua-webservices-backend/src/utils/password.util.js

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;
export const PASSWORD_SPECIAL_CHARS = "!@#$%^&*()_+-=[]{};':\"\\|,.<>/?~`";

export const PASSWORD_RULES = [
    {
        id: "length",
        label: `Entre ${PASSWORD_MIN_LENGTH} y ${PASSWORD_MAX_LENGTH} caracteres`,
        test: (p) =>
            p.length >= PASSWORD_MIN_LENGTH && p.length <= PASSWORD_MAX_LENGTH,
    },
    { id: "lower", label: "Una letra minúscula", test: (p) => /[a-z]/.test(p) },
    { id: "upper", label: "Una letra mayúscula", test: (p) => /[A-Z]/.test(p) },
    { id: "number", label: "Un número", test: (p) => /\d/.test(p) },
    {
        id: "special",
        label: "Un carácter especial (!@#$%…)",
        test: (p) => [...p].some((c) => PASSWORD_SPECIAL_CHARS.includes(c)),
    },
    { id: "spaces", label: "Sin espacios", test: (p) => p.length > 0 && !/\s/.test(p) },
];

export const checkPassword = (password = "") =>
    PASSWORD_RULES.map((r) => ({ ...r, ok: r.test(password) }));

export const isPasswordValid = (password = "") =>
    PASSWORD_RULES.every((r) => r.test(password));

/** Genera una contraseña aleatoria que cumple la política. */
export const generatePassword = (length = 12) => {
    const lower = "abcdefghijkmnpqrstuvwxyz";
    const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const digits = "23456789";
    const special = "!@#$%&*?-_+=";
    const all = lower + upper + digits + special;

    const rand = (max) => {
        const buf = new Uint32Array(1);
        crypto.getRandomValues(buf);
        return buf[0] % max;
    };
    const pick = (set) => set[rand(set.length)];

    const chars = [pick(lower), pick(upper), pick(digits), pick(special)];
    while (chars.length < length) chars.push(pick(all));

    // Fisher–Yates
    for (let i = chars.length - 1; i > 0; i--) {
        const j = rand(i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join("");
};
