import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const availableRooms = [
    { id: 'geral', name: 'Sala Principal', desc: 'Conversas gerais' },
    { id: 'jogos', name: 'Sala de Jogos', desc: 'Discussão sobre games' },
    { id: 'musica', name: 'Amantes de Música', desc: 'Descubra novos sons' },
    { id: 'dev', name: 'Devs & Programação', desc: 'Tire suas dúvidas' },
    { id: 'filmes', name: 'Cinema', desc: 'O que você assistiu?' },
    { id: 'animes', name: 'Animes & Mangás', desc: 'Discussões de fãs' },
    { id: 'esportes', name: 'Esportes', desc: 'Resultados e debates' },
    { id: 'aleatorio', name: 'Aleatório', desc: 'Assuntos variados' },
];

const Rooms = () => {
    const { nickname } = useSelector((state) => state.chat);
   
    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-[#2a2a2a] p-8'>
            <div className='w-full max-w-6xl'>
                <h1 className='text-4xl font-bold text-white mb-4'>
                    Olá, <span className='text-[#1DB954]'>{nickname || 'Usuário'}</span>!
                </h1>
                <h2 className='text-2xl text-gray-300 mb-8'>Escolha uma sala para entrar:</h2>
                
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {availableRooms.map((room) => (
                        <Link 
                            key={room.id} 
                            to={`/chat/${room.id}`}
                            className='block p-6 rounded-lg shadow-2xl bg-[#1e1e1e] 
                                       hover:bg-[#111] hover:scale-105 transition-all
                                       border border-gray-700 hover:border-[#1DB954]'
                        >
                            <h3 className='text-2xl font-bold text-white mb-2'>{room.name}</h3>
                            <p className='text-gray-400'>{room.desc}</p>
                        </Link>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default Rooms;