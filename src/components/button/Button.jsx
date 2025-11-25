const Button = ({onclick, text, className, type}) => {
    return (
        <div className={className}>
            <button onClick={onclick} type={type}>
                {text}
            </button>
        </div>
    )
}

export default Button;