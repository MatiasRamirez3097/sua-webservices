import Label from "../label/Label";
import Div from "../div/Div";

const TextArea = ({ 
    label, 
    name, 
    onChange, 
    placeholder, 
    value,
    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y", 
}) => {
    return (
        <>
            <Div>
                <Label label={label}/>

                <textarea
                    name={name}
                    onChange={onChange}
                    value={value}
                    rows={3}
                    className={className}
                    placeholder={placeholder}
                />
            </Div>
        </>
    );
};

export default TextArea;
