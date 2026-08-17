import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-page py-32 text-center">
      <p className="text-xs uppercase tracking-widest2 text-green">404</p>
      <h1 className="text-4xl sm:text-5xl mt-3">Page Not Found</h1>
      <p className="text-muted mt-4 text-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary inline-flex mt-8">Back to Home</Link>
    </div>
  );
}
