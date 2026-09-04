import { useFlash } from "../context/FlashContext";

export default function Flash() {
    const { messages, dismiss } = useFlash();
    if (!messages.length) return null;

    return (
        <>
            {messages.map(({ id, type, text }) => (
                <div
                    key={id}
                    className={`alert alert-${type === "success" ? "success" : "danger"} alert-dismissible fade show col-md-6 offset-md-3`}
                    role="alert"
                >
                    {text}
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => dismiss(id)}
                    ></button>
                </div>
            ))}
        </>
    );
}
