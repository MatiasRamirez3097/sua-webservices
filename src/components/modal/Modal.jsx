const Modal = ({ children }) => {
    return (
        <div
            className="relative z-60"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div className="fixed inset-0 bg-gray-800 bg-opacity-60 transition-opacity"></div>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <div className="relative transform overflow-hidden rounded-xl bg-gray-900 text-white shadow-xl transition-all w-full max-w-4xl p-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
