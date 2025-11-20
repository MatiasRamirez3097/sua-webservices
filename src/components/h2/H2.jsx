const H2 = ({
  label,
  className = "text-2xl font-bold text-white text-center pb-10 pt-5"
}) => {
    return(
        <h2 className={className}>
            {label}
        </h2>
    );
};

export default H2;