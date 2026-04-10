import Swal from "sweetalert2";

const BORDER_COLORS = {
    success: "border-green-500",
    error: "border-red-500",
    warning: "border-yellow-500",
    info: "border-indigo-500",
    question: "border-indigo-400",
};

export const sweetAlert = {
    fire: ({
        type = "info",
        title = "",
        message = "",
        showCancelButton = false,
        confirmButtonText = "Aceptar",
        cancelButtonText = "Cancelar",
        input = null,
        inputPlaceholder = "",
        inputValue = "",
        ...rest
    }) => {
        return Swal.fire({
            icon: type,
            background: "#1f2937",
            buttonsStyling: false,
            showCancelButton,
            confirmButtonText,
            cancelButtonText,

            reverseButtons: true,

            html: `
                <div class="text-gray-100 p-6 border-b-4 ${BORDER_COLORS[type]} text-left">
                    <h2 class="text-xl font-semibold mb-2">${title}</h2>
                    ${message ? `<p class="text-gray-300 mb-4">${message}</p>` : ""}
                    ${
                        input
                            ? `<input
                                id="swal-custom-input"
                                type="${input}"
                                placeholder="${inputPlaceholder}"
                                value="${inputValue}"
                                class="bg-gray-700 text-white rounded-lg px-3 py-2 mt-2 w-full border border-gray-600 focus:outline-none focus:border-indigo-500"
                              />`
                            : ""
                    }
                </div>
            `,

            customClass: {
                popup: "rounded-2xl",
                icon: "mt-4",
                htmlContainer: "!p-0 text-gray-300",
                actions: "flex gap-4 justify-center mt-6",
                confirmButton:
                    "bg-indigo-700 hover:bg-indigo-600 px-5 py-2 rounded-lg font-semibold text-white",
                cancelButton:
                    "bg-red-600 hover:bg-red-500 px-5 py-2 rounded-lg font-semibold text-white",
            },

            preConfirm: input
                ? () => {
                      const val =
                          document.getElementById("swal-custom-input")?.value;
                      if (!val) {
                          Swal.showValidationMessage("Este campo es requerido");
                      }
                      return val;
                  }
                : undefined,

            ...rest,
        });
    },
};
