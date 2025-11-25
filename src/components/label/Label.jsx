const Label = ({
  label,
  className = "block text-xl font-semibold text-white text-center pb-2 mb-4"
}) => {
    return(
        <label className={className}>
            {label}
        </label>
    );
};

export default Label;