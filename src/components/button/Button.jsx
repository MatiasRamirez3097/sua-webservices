const Button = ({ onClick, text, className, type }) => {
    return (
        <button className={className} onClick={onClick} type={type}>
            {text}
        </button>
    );
};

export default Button;
