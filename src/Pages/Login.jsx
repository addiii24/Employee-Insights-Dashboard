import { useState } from 'react';

const Login   =({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    handleLogin(username, password);
    setUsername('');
    setPassword('');
  };

  return (
    <div className="font-sans bg-[#f6f7f8] dark:bg-[#101822] min-h-screen flex items-center justify-center p-4 w-full">
      <div className="w-full max-w-md">

        <div className="flex flex-col items-center mb-8">
          <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-bold tracking-tight text-center">
            Employee Insights Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-center">
            Please enter your Username and Password.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none rounded-xl p-8 border border-slate-100 dark:border-slate-800">
          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-[#136dec] transition-all sm:text-sm"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => 
                    setPassword(e.target.value)
                  }
                  placeholder="Enter Your Password"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-[#136dec] transition-all sm:text-sm"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#136dec] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-[0.98]"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;