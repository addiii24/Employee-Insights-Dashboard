import React, { useState, useEffect, useRef } from 'react';
import Header from '../Others/Header.jsx';

const Datafetch = ({ changeuser }) => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrollTop, setScrollTop] = useState(0);

  // Constants for Virtualization
  const itemHeight = 72; // Height of each row based on your design
  const containerHeight = 500; // Fixed view window
  const buffer = 4;
  
useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const payload = {
        username: "test",
        password: "123456",
        draw: "1",
        start: "0",
        length: "40",
        table: "employee",
        action: "fetch"
      };

      const response = await fetch('/api/backend_dev/gettabledata.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result && result.TABLE_DATA && result.TABLE_DATA.data) {
        const formattedData = result.TABLE_DATA.data.map(emp => ({
          name: emp[0],
          role: emp[1],
          city: emp[2],
          id: emp[3],
          startDate: emp[4],
          salary: emp[5].replace('$', '').replace(',', '') // optional: format salary if needed by UI
        }));
        setEmployees(formattedData);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };
  fetchEmployees();
}, []);

  // --- Virtualization Math ---
  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  const filteredData = employees.filter(emp => 
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalHeight = filteredData.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  const endIndex = Math.min(
    filteredData.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + buffer
  );

  const visibleSlice = filteredData.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  return (
    <div className="font-sans bg-[#f6f7f8] dark:bg-[#101822] min-h-screen">
      <Header changeuser={changeuser} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title & Search Bar Area */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Employee List</h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Manage and view detailed information for all registered employees.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input 
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-[#136dec] outline-none w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* The Virtualized Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="w-full text-left border-collapse">
            {/* Static Header */}
            <div className="grid grid-cols-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Employee ID</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Name</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">City</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Salary</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Action</div>
            </div>

            {/* Scrollable Virtual Container */}
            <div 
              onScroll={handleScroll}
              className="relative overflow-y-auto"
              style={{ height: `${containerHeight}px` }}
            >
              {/* Phantom Space for Scrollbar */}
              <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
                {/* Windowed Content */}
                <div 
                  className="absolute top-0 left-0 w-full"
                  style={{ transform: `translateY(${offsetY}px)` }}
                >
                  {visibleSlice.map((emp, idx) => (
                    <div 
                      key={emp.id || idx}
                      className="grid grid-cols-5 items-center px-6 border-b border-slate-100 dark:border-slate-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors"
                      style={{ height: `${itemHeight}px` }}
                    >
                      <div className="text-sm font-medium text-slate-500">#EMP00{idx + 1}</div>
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-blue-100 text-[#136dec] flex items-center justify-center text-xs font-bold">
                          {emp.name?.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{emp.name}</span>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">{emp.city}</div>
                      <div className="text-sm font-mono font-medium text-slate-700 dark:text-slate-200">${emp.salary}</div>
                      <div className="text-right">
                        <button className="text-sm font-bold text-[#136dec] hover:underline underline-offset-4">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Table Footer Stats */}
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/30">
            <span className="text-sm text-slate-500">
              Showing {visibleSlice.length} of {filteredData.length} employees
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Datafetch;