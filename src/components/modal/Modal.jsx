import Div from "../div/Div";

const Modal = ({
    children
}) => {
    return (
        <>
            <Div>   
                {children}
            </Div> 
        </>
    );
};

export default Modal;