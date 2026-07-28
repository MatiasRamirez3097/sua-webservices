const ModalLogin = ({ children }) => {
    return (
        <div className="fixed inset-0 z-50 bg-gray-950 flex items-center justify-center">
            <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-10">
                {children}
            </div>
        </div>
    );
};

export default ModalLogin;
