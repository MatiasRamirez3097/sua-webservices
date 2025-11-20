const Button = ({onclick, text, className}) => {
    return (
        <div className={className}>
            <button onClick={onclick}>
                {text}
            </button>
        </div>
    )
}

export default Button;