import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/authContext'
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth'
import wf41_logo from '../../../assets/wf41_logo.png';
import wf41_name_logo from '../../../assets/wf41_name_logo_nobg.png';
import wf41_fullname_logo from '../../../assets/wf41_fullname_logo_nobg.png';

const Register = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { userLoggedIn } = useAuth();

    const validatePassword = (password) => {
        const minLength = 6;
        const alphanumerical = /^(?=.*[A-Za-z])(?=.*\d)/;
        const specialCharacter = /[@$!%*#?&]/;

        if (password.length < minLength) {
            return 'Password must be at least 6 characters long';
        }
        if (!alphanumerical.test(password)) {
            return 'Password must containn at least one number';
        }
        if (!specialCharacter.test(password)) {
            return 'Password must contain at least one special character';
        }
        return '';
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear any previous error messages

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setErrorMessage(passwordError);
            return;
        }

        if (!isRegistering) {
            setIsRegistering(true);
            try {
                await doCreateUserWithEmailAndPassword(email, password);
                navigate('/home'); // Redirect to home after successful registration
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    setErrorMessage('Email is already in use');
                } else {
                    setErrorMessage('Failed to create an account. Please try again.');
                }
                setIsRegistering(false);
            }
        }
    };
    return (
        <>
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}

            <main className="w-full h-screen flex self-center place-content-center place-items-center mt-16 mb-16">
                <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
                <div className="flex justify-center mb-4">
                        <img src={wf41_name_logo} alt="Logo" className='h-20' />  
                    </div>
                   
                    <div className="text-center mb-6">
                        <div className="mt-2">
                            <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">Create a New Account</h3>
                        </div>

                    </div>
                    <form
                        onSubmit={onSubmit}
                        className="space-y-4"
                    >
                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Email
                            </label>
                            <input
                                type="email"
                                autoComplete='email'
                                required
                                value={email} onChange={(e) => { setEmail(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Password
                            </label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete='new-password'
                                required
                                value={password} onChange={(e) => { setPassword(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Confirm Password
                            </label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete='off'
                                required
                                value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        {errorMessage && (
                            <span className='text-red-600 font-bold'>{errorMessage}</span>
                        )}

                        <button
                            type="submit"
                            disabled={isRegistering}
                            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isRegistering ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
                        >
                            {isRegistering ? 'Signing Up...' : 'Sign Up'}
                        </button>
                        <div className="text-sm text-center">
                            Already have an account? {'   '}
                            <Link to={'/login'} className="text-center text-sm hover:underline font-bold">Continue</Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}

export default Register