import { useLocation } from "wouter-preact";

export default function Input(props: any) {
    const [location, setLocation] = useLocation();

    const handleSubmit = (value: string) => {
        if (value && value.length > 0) {
            if (typeof props.onSubmit == 'function')  {
                props.onSubmit(value);
            } else if (typeof props.href == 'string') {
                setLocation(props.href + '/' + value);
            } else {
                setLocation(location + '/' + value);
            }
        }
    }

    return <input type="text" value={props.value || ""}
        onChange={(e: any) => {
            if (props.onChange) {
                props.onChange(e.target.value);
            }
        }}
        onKeyDown={(e: any) => {
            if (e.key === 'Enter') {
                handleSubmit(e.target.value);
            }
        }}
        onBlur={(e: any) => handleSubmit(e.target.value)}
        className="bg-transparent border-4"
    />
}