import { FIELD_CLASS } from "../ui/styles";

const TextArea = ({ name, onChange, placeholder, value, rows = 4, maxLength, id }) => {
    const length = value?.length ?? 0;
    return (
        <div>
            <textarea
                id={id}
                name={name}
                onChange={onChange}
                value={value ?? ""}
                rows={rows}
                maxLength={maxLength}
                placeholder={placeholder}
                className={`${FIELD_CLASS} h-auto py-2 resize-y leading-relaxed`}
            />
            {maxLength && (
                <p className="mt-1 text-right text-xs text-faint tabular">
                    {length} / {maxLength}
                </p>
            )}
        </div>
    );
};

export default TextArea;
