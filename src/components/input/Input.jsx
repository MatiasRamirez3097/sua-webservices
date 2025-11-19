import Label from "../label/Label";
import Div from "../div/Div";

const Input = ({
    label,
    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y",
    name,
    type,
    value,
    onChange, 
}) => {
    return (
        <>
            <Div>
                <Label label={label}/>
                    <input 
                        type={type}
                        value={value}
                        step="1"
                        className={className}
                        name={name}
                        onChange={onChange}
                    />
            </Div>        
        </>    
    );
};

export default Input;