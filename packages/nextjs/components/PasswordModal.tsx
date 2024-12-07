// PasswordModal.tsx
import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPasswordSubmit: (password: string) => void;
}

export const PasswordModal: React.FC<Props> = ({ isOpen, onClose, onPasswordSubmit }) => {
    const [password, setPassword] = useState<string>('');

    if (!isOpen) return null;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onPasswordSubmit(password);
    };

    return (
        <div className="fixed inset-0 bg-base-200 bg-opacity-50 flex justify-center items-center">
            <div className="bg-base-100 p-4 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold">Enter Your Password</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-2 p-2 border rounded w-full"
                        placeholder="Password"
                        required
                    />
                    <button type="submit" className="bg-secondary hover:bg-primary text-white font-bold py-2 px-4 rounded mt-4">
                        Submit
                    </button>
                    <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2 mt-4">
                        Close
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PasswordModal;
