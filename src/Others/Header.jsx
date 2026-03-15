import React from 'react';
import { setLocalstorage } from '../Utils/Localstorage.jsx';



const Header =() => {

//     const Logoutuser = () => {
//     localStorage.setItem('loggedinUser',' ')
//     props.Changeuser(' ')
// }
    return (
        <div className="flex justify-between items-center p-8 bg-[#111] border-b border-emerald-500/10">
            <div>
                <h1 className="text-xl font-medium text-gray-400">
                    Hello, <br />
                    <span className="text-3xl font-bold text-white leading-tight">
                        Aditya<span className="inline-block hover:rotate-12 transition-transform cursor-default">👋</span>
                    </span>
                </h1>
            </div>
            <button 
                onClick={() => {
                    localStorage.clear();
                    window.location.reload(); 
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition-all active:scale-95 shadow-lg shadow-red-900/20"
            >
                Log Out
            </button>
        </div>
    );
}

export default Header;