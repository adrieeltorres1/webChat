import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from 'antd'; // Usando o 'antd' como na sua tela de Join

const CriarUsers = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Boa prática
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault(); // Evita o refresh da página
        setError(null);
        setSuccess(null);

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        if (username.trim() === '' || password.trim() === '') {
            setError('Usuário e senha são obrigatórios.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/users/registrarUsuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Falha ao criar usuário.');
            }

            // 5. SUCESSO!
            setSuccess('Conta criada com sucesso! Redirecionando para o login...');

            setTimeout(() => {
                navigate('/'); 
            }, 2000);

        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-[#2a2a2a]'>
            <form onSubmit={handleRegister} className='text-white flex flex-col items-center gap-6 p-8 rounded-lg shadow-2xl bg-[#1e1e1e] w-80 sm:w-96'>
                <h1 className='text-4xl font-bold mb-4'>Criar Acesso</h1>

                <input
                    type="text"
                    placeholder='Insira o seu nickname'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='p-3 w-full rounded-md bg-[#2a2a2a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1DB954]'
                />
                <input
                    type="password"
                    placeholder='Digite sua senha'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='p-3 w-full rounded-md bg-[#2a2a2a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1DB954]'
                />
                <input
                    type="password"
                    placeholder='Confirme sua senha'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className='p-3 w-full rounded-md bg-[#2a2a2a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1DB954]'
                />

                {/* Feedback de Erro */}
                {error && (
                    <Alert
                        message={error}
                        type="error"
                        showIcon
                        closable
                        onClose={() => setError(null)}
                        className="w-full"
                    />
                )}

                {/* Feedback de Sucesso */}
                {success && (
                    <Alert
                        message={success}
                        type="success"
                        showIcon
                        className="w-full"
                    />
                )}
                
                {/* Link para voltar ao Login */}
                <nav className='list-none'>
                    <li>
                        <p className='flex items-center gap-1'>
                            Já tem uma conta? 
                            <Link to='/' className='hover:text-[#1DB954] cursor-pointer'>
                                Faça o login
                            </Link>
                        </p>
                    </li>
                </nav>

                <button
                    type="submit"
                    disabled={!!success} // Desabilita o botão após o sucesso
                    className='w-full p-3 rounded-md bg-[#1DB954] text-white font-bold hover:bg-[#1ed760] transition-colors disabled:opacity-50'
                >
                    Criar Conta
                </button>
            </form>
        </div>
    );
}

export default CriarUsers;