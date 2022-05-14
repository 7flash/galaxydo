export default function ErrorBoundary(props) {
    return <div className="m-8">
        <h2>ErrorBoundary</h2>
        {props.children}
    </div>
}