const InputForm = (props) => {
    const { placeholder = 'Nhập text', className, ...rests } = props;
    const handleOnchangeInput = (e) => {
        props.onChange(e.target.value);
    };
    return <input placeholder={placeholder} className={className} value={props.value} {...rests} onChange={handleOnchangeInput} />;
};

export default InputForm;
