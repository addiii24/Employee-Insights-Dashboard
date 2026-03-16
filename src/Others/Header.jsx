import React from 'react';
import { setlocalstorage } from '../Utils/Localstorage.jsx';



const Header =(props) => {
    return (
        <div className="flex justify-between items-center p-8 bg-[#111] border-b border-emerald-500/10">
            <div>
                <h1 className="text-xl font-medium text-gray-400">
                    Hello, <br />
                    <span className="text-3xl font-bold text-white leading-tight">
                        testuser<span className="inline-block hover:rotate-12 transition-transform cursor-default">👋</span>
                    </span>
                </h1>
            </div>
            <button 
                onClick={() => {
                    // let the App.jsx logout handle clear the state
                    if (props.changeuser) {
                        props.changeuser();
                    } else {
                        // fallback if changeuser is not provided
                        localStorage.removeItem('loggedInUser');
                        window.location.href = '/login';
                    }
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition-all active:scale-95 shadow-lg shadow-red-900/20"
            >
                Log Out
            </button>
        </div>
    );
}

export default Header;