const Button = ({onclick: any, text: string}) => {
    return (
        <button onClick={onclick}>
            {text}
        </button>
    )
}

export default Button;