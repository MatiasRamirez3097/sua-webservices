import Swal from "sweetalert2";

const escapeHtml = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/** Permite solo <b> en los mensajes (el resto se escapa). */
const formatMessage = (s = "") =>
    escapeHtml(s).replace(/&lt;b&gt;/g, "<b>").replace(/&lt;\/b&gt;/g, "</b>");

const BTN = "inline-flex items-center justify-center h-9 px-4 rounded-md border text-sm font-medium transition-colors";
const BTN_PRIMARY = `${BTN} bg-accent text-white border-accent hover:bg-accent-hover`;
const BTN_DANGER = `${BTN} bg-danger-strong text-white border-danger-strong hover:bg-danger-hover`;
const BTN_SECONDARY = `${BTN} bg-surface text-ink border-line-strong hover:bg-subtle`;

const ACCENT_BAR = {
    success: "bg-ok",
    error: "bg-danger",
    warning: "bg-warn",
    info: "bg-accent",
    question: "bg-accent",
};

/**
 * Diálogos de la app.
 * - type "success" sin botón de cancelar → aviso breve (toast) que no interrumpe.
 * - danger: true → el botón de confirmar se muestra en rojo (acciones destructivas).
 */
export const sweetAlert = {
    fire: ({
        type = "info",
        title = "",
        message = "",
        showCancelButton = false,
        confirmButtonText = "Aceptar",
        cancelButtonText = "Cancelar",
        danger = false,
        input = null,
        inputPlaceholder = "",
        inputValue = "",
        ...rest
    }) => {
        if (type === "success" && !showCancelButton && !input) {
            return Swal.fire({
                toast: true,
                position: "bottom-end",
                timer: 3500,
                timerProgressBar: false,
                showConfirmButton: false,
                buttonsStyling: false,
                html: `
                    <div class="flex items-start gap-3 text-left">
                        <span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ok"></span>
                        <div>
                            <p class="text-sm font-semibold text-ink">${escapeHtml(title)}</p>
                            ${message ? `<p class="mt-0.5 text-sm text-muted">${formatMessage(message)}</p>` : ""}
                        </div>
                    </div>`,
                customClass: {
                    popup: "!rounded-md !border !border-line !shadow-md !px-4 !py-3",
                    htmlContainer: "!m-0 !p-0",
                },
                ...rest,
            });
        }

        return Swal.fire({
            buttonsStyling: false,
            showCancelButton,
            confirmButtonText,
            cancelButtonText,
            reverseButtons: true,
            focusCancel: danger,
            html: `
                <div class="relative px-5 pt-5 pb-2 text-left">
                    <span class="absolute left-0 top-5 h-6 w-1 rounded-r ${ACCENT_BAR[type] ?? "bg-accent"}"></span>
                    <h2 class="text-base font-semibold text-ink">${escapeHtml(title)}</h2>
                    ${message ? `<p class="mt-1.5 text-sm leading-relaxed text-muted">${formatMessage(message)}</p>` : ""}
                    ${
                        input
                            ? `<input
                                id="swal-custom-input"
                                type="${escapeHtml(input)}"
                                placeholder="${escapeHtml(inputPlaceholder)}"
                                value="${escapeHtml(inputValue)}"
                                class="mt-3 block h-9 w-full rounded-md border border-line-strong bg-surface px-3 text-sm text-ink focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                              />`
                            : ""
                    }
                </div>`,
            customClass: {
                popup: "sua-dialog",
                confirmButton: danger || type === "error" && showCancelButton ? BTN_DANGER : BTN_PRIMARY,
                cancelButton: BTN_SECONDARY,
            },
            preConfirm: input
                ? () => {
                      const val = document.getElementById("swal-custom-input")?.value;
                      if (!val) Swal.showValidationMessage("Este campo es requerido");
                      return val;
                  }
                : undefined,
            ...rest,
        });
    },
};
