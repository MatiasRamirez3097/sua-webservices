const Modal = ({ children }) => {
    return (
        <div
            className="relative z-60"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            {/* Fondo oscurecido */}
            <div className="fixed inset-0 bg-gray-800 bg-opacity-60 transition-opacity"></div>

            {/* Contenedor principal */}
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">

                    {/* Caja del modal */}
                    <div className="relative transform overflow-hidden rounded-xl bg-gray-900 text-white shadow-xl transition-all w-full max-w-lg p-8">

                        {children}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;