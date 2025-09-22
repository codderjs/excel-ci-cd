import { useState } from 'react';
import axios from 'axios';
import { validateForm } from './validateForm.js';
const API_BASE = 'http://localhost:5000/api';


const AddUser = () => {

    const [id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');


    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSubmitError('');
        setSuccessMessage('');

        // Build form data first
        const formData = { id, username, email, age: Number(age) };

        // Validate      
        const validationErrors = validateForm(formData);
        // if any error return {email: 'Invalid email format'} or not error return empty object {}.
        //console.log("validationErrors", validationErrors); // {email: 'Invalid email format'}
        setErrors(validationErrors);
        //console.log(Object.keys(validationErrors)); // ['email']
        // console.log(Object.keys(validationErrors).length) // 1

        if (Object.keys(validationErrors).length > 0) return; // stop submit

        // ---------------------------------------------
        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE}/users`, formData);
            setSuccessMessage(response?.data?.message);
            setId('');
            setUsername('');
            setEmail('');
            setAge('');
        } catch (error) {
            setSubmitError(
                error.response?.data?.message || 'Failed to create user. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h1 className="text-3xl font-bold mb-8 text-center">Add New User</h1>

            {/* Messages */}
            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md border border-green-300">
                    {successMessage}
                </div>
            )}
            {submitError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-300">
                    {submitError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* ID */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                    <input
                        type="text"
                        id="id"
                        name="id"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                        disabled={loading}
                        className={`p-2 w-full border rounded-md focus:ring focus:ring-blue-300 ${errors.id ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Enter unique ID"
                    />
                    {errors.id && <p className="text-red-500 text-sm mt-1">{errors.id}</p>}
                </div>

                {/* Username */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                        className={`p-2 w-full border rounded-md focus:ring focus:ring-blue-300 ${errors.username ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Enter username"
                    />
                    {errors.username && (
                        <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className={`p-2 w-full border rounded-md focus:ring focus:ring-blue-300 ${errors.email ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Enter email"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                {/* Age */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1"> Age</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                        min="0"
                        disabled={loading}
                        className={`p-2 w-full border rounded-md focus:ring focus:ring-blue-300 ${errors.age ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Enter age"
                    />
                    {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200 disabled:opacity-50"
                >
                    {loading ? "Submitting..." : "Add User"}
                </button>
            </form>
        </div>
    );
};

export default AddUser;