import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="row mt-3">
            <div className="alert alert-danger col-md-6 offset-md-3" role="alert">
                <p>Page not found</p>
                <Link to="/listings">Back to all listings</Link>
            </div>
        </div>
    );
}
