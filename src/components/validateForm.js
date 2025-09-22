

// Validate form inputs
export const validateForm = ({ id, username, email, age }) => {
    const newErrors = {};
    if (!id) newErrors.id = 'ID is required';
    if (!username) newErrors.username = 'Username is required';
    if (!email) {
        newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Invalid email format';
    }
    if (!age) {
        newErrors.age = 'Age is required';
    } else if (isNaN(age) || Number(age) < 0) {
        newErrors.age = 'Age must be a number ≥ 0';
    }

    return newErrors;
};
