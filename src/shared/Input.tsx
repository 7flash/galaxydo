export default function Input(props) {
    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            props.onSubmit(e.target.value);
        }
    }

    return <input type="text" value={props.value}
        onChange={e => props.onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={(e) => props.onSubmit(e.target.value)}
        className="bg-transparent border-4"
    />
}