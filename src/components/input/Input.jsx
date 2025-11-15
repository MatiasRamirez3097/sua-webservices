const Input = ({ name, onChange, type, value }) => {
    return (
        <div className="w-full max-w-4xl mx-auto border border-gray-300 p-6 bg-gray-800 rounded-xl mb-8">

            <h2 className="text-2xl font-bold text-white text-center mb-6">
                Ingresar la leyenda de resolución
            </h2>

            {/* Campo de texto adaptativo */}
            <textarea
                name={name}
                onChange={onChange}
                value={value}
                rows={3}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                placeholder="Escribe aquí la resolución..."
            />
        </div>
    );
};

export default Input;