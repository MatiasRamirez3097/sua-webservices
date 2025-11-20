export const ls = {
    getText: (key) => {
        return localStorage.getItem(key);
    },
    get: (key) => {
        return JSON.parse(localStorage.getItem(key));
    },
    set: (key, value) => {
        JSON.stringify(localStorage.setItem(key, value));
    },
    clear: () => {
        localStorage.clear();
    },
};
