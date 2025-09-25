// src/components/Header.jsx
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="flex items-center justify-between p-4 bg-blue-600 text-white">
            <h1 className="text-xl font-bold">Ci/Cd and  sonarcloud scan</h1>
            <nav className="space-x-4">
                <Link to="/" className="hover:underline">Add User</Link>
                <Link to="/users" className="hover:underline">All Users</Link>
            </nav>
        </header>
    );
}
