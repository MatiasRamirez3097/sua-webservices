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
    }) => {
        return Swal.fire({
            icon: type, // ícono nativo
            background: "#1f2937", // bg-gray-800
            buttonsStyling: false,
            showCancelButton,
            confirmButtonText,
            cancelButtonText,

            customClass: {
                popup: "rounded-2xl",
                icon: "mt-4",
                title: "hidden", // no usamos el title nativo
                confirmButton:
                    "bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded-lg font-semibold text-white",
                cancelButton:
                    "bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg font-semibold text-white",
            },

            html: `
        <div class="text-gray-100 p-6 border-b-6 ${BORDER_COLORS[type]} text-left">
          <h2 class="text-xl font-semibold mb-2">${title}</h2>
          <p class="text-gray-300">${message}</p>
        </div>
      `,
        });
    },
};
