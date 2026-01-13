const Button = ({ onClick, children, className, type, text }) => {
    return (
        <button className={className} onClick={onClick} type={type}>
            {children ? children : text}
        </button>
    );
};

export default Button;
