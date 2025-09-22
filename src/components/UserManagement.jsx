import { useEffect, useState } from 'react';
import axios from 'axios';
const API_BASE = 'http://localhost:5000/api';

export default function UserManagement() {

    const [users, setUsers] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [importFile, setImportFile] = useState(null);
    const [importStatus, setImportStatus] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [loading, setLoading] = useState(false);


    // Fetch all users
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_BASE}/users`);
            setUsers(response?.data?.users);
        } catch (error) {
            setSubmitError('Failed to fetch users. Please try again.');
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        // Fetch users once on mount
        fetchUsers();
    }, []); // empty dependency array -> runs only once

    useEffect(() => {
        // Clear messages after 5 seconds
        if (successMessage || submitError || importStatus) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setSubmitError('');
                setImportStatus('');
            }, 5000);

            // cleanup function that run second time any dependency change.
            // On page refresh, timers are automatically cleaned by the browser, but React’s cleanup code does not run.
            // when the page refreshes, the browser automatically cleans up timers (setTimeout, setInterval) and any other JavaScript execution.
            return () => clearTimeout(timer);
        }
    }, [successMessage, submitError, importStatus]);




    // Handle Excel export
    const handleExport = async () => {
        try {
            setLoading(true);
            setSubmitError('');
            setSuccessMessage('');

            const response = await axios.get(`${API_BASE}/users/export`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            //console.log("url", url) //  blob:http://localhost:5173/531b68a9-c7a8-4842-a0fd-de3f536a8a3d
            const link = document.createElement('a');  // create <a> element dynamically
            link.href = url;
            const uniqueID = crypto.randomUUID(); // generate unique id. No package install.

            link.setAttribute('download', `${uniqueID}.xlsx`);
            // console.log("link", link); // <a href="blob:http://localhost:5173/096fded1-99e0-474a-a8c0-15d8278fc7d6" download="73c33055-4ae6-4737-86c4-f5dbab891e14.xlsx"> </a>

            document.body.appendChild(link); // adds <a>73c33055-4ae6-4737-86c4-f5dbab891e14.xlsx</a> to <body>
            link.click(); // automatically triggers the alert like---show popup  5173/531b68a9-c7a8-4842-a0fd-de3f536a8a3d.xlsx --- Openfile link
            link.remove() // remove  <body> </body> automatic when <a> </a> is download.--- clean up, remove from DOM
            window.URL.revokeObjectURL(url); // tells the browser: “I’m done with this URL, free its memory.”

            // Manually set message // backend  res.download() after not sent json().
            setSuccessMessage('Users exported successfully!');
        } catch (error) {
            setSubmitError('Failed to export users. Please try again.');
            console.error('Export error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle Excel import
    const handleImport = async () => {
        if (!importFile) {
            setSubmitError('Please select an Excel file');
            return;
        }

        setLoading(true);
        setImportStatus('');
        setSubmitError('');
        setSuccessMessage('');

        // provide by Browser.
        const formData = new FormData();
        // console.log("formData", formData); // {} --- empty object
        //console.log("importFile", importFile); // tuhin.xlsx
        formData.append('excelFile', importFile);

        try {
            const response = await axios.post(`${API_BASE}/users/import`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setImportStatus(response.data.message);
            setSuccessMessage(`Imported ${response.data.imported} users successfully`);
            setImportFile(null);
            await fetchUsers(); // Refresh user list
        } catch (error) {
            setSubmitError(error.response?.data?.message || 'Failed to import users');
            if (error.response?.data?.errors) {
                setImportStatus(`Errors: ${error.response.data.errors.join(', ')}`);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h1 className="text-3xl font-bold mb-8 text-center">Excel Operations</h1>

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

            {importStatus && (
                <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-md border border-blue-300">
                    {importStatus}
                </div>
            )}


            {/* Excel Import/Export */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                <div className="p-4 bg-gray-50 rounded-md">
                    <div>
                        <h3 className="text-lg font-medium mb-2">Export Users</h3>
                        <p className="text-sm text-gray-600 mb-3">
                            Download all users as an Excel file (.xlsx)
                        </p>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={loading}
                        className="w-full mt-22 bg-green-500 text-white p-2  mb-4 rounded-md hover:bg-green-600 transition duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Exporting...' : 'Export to Excel'}
                    </button>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Import Users</h3>
                    <p className="text-sm text-gray-600 mb-3">
                        Upload an Excel file with columns: ID, Username, Email, Age
                    </p>

                    <div className="relative w-full">
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            id="excelFile"
                            onChange={(e) => setImportFile(e.target.files[0])}
                            disabled={loading}
                            className="absolute w-full h-full opacity-0 cursor-pointer"
                        />
                        <label
                            htmlFor="excelFile"
                            className="flex items-center justify-between p-2 border border-gray-300 rounded-md cursor-pointer bg-white"
                        >
                            <span>{importFile ? importFile.name : 'Select Excel File'}</span>
                        </label>
                    </div>

                    {importFile && (
                        <p className="text-sm text-gray-600 mt-2">Selected: {importFile.name}</p>
                    )}
                    <button
                        onClick={handleImport}
                        disabled={loading || !importFile}
                        className="w-full mt-3 bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 transition duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Importing...' : 'Import from Excel'}
                    </button>
                </div>

            </div>
            {/* User Data Table */}
            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-4">Users ({users.length})</h2>
                {users.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-md">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        ID
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Username
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Email
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Age
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="border-t">
                                        <td className="px-4 py-2">{user.id}</td>
                                        <td className="px-4 py-2">{user.username}</td>
                                        <td className="px-4 py-2">{user.email}</td>
                                        <td className="px-4 py-2">{user.age}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500">No users found. Add or import users to see them here.</p>
                )}
            </div>
        </div>
    )
}
