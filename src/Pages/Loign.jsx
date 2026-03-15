import { useState } from 'react';


function Login({handleLogin}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    handleLogin(username, password);
    
    setUsername('');
    setPassword('');
  };

  return (
    <div className='flex justify-center items-center h-screen w-screen bg-gray-900'>
      <div className='bg-gray-800 p-10 md:p-16 rounded-3xl shadow-2xl border border-emerald-500/30'>
        
        <h2 className='text-3xl font-bold text-emerald-500 mb-8 text-center'>Employee Insight Dashboard</h2>
        
        <form 
          onSubmit={submitHandler}
          className='flex flex-col gap-6 w-72 md:w-80'
        >
          <input 
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='w-full outline-none bg-gray-700/50 text-white border-2 border-emerald-600 rounded-full px-6 py-3 transition-all focus:border-emerald-400 focus:bg-gray-700 placeholder:text-gray-400' 
            type="text" 
            placeholder='Enter Your Username'
          />

          <input 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full outline-none bg-gray-700/50 text-white border-2 border-emerald-600 rounded-full px-6 py-3 transition-all focus:border-emerald-400 focus:bg-gray-700 placeholder:text-gray-400' 
            type="password" 
            placeholder='Enter Your Password'
          />

          <button className='w-full text-white font-semibold bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all rounded-full py-3 mt-2 shadow-lg shadow-emerald-900/20'>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;