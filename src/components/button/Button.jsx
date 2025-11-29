const Button = ({ onClick, text, className, type }) => {
    return (
        <div className={className}>
            <button onClick={onClick} type={type}>
                {text}
            </button>
        </div>
    );
};

export default Button;
