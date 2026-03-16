import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Others/Header.jsx';

const Datafetch = ({ changeuser }) => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrollTop, setScrollTop] = useState(0);
  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const itemHeight = 72;
  const containerHeight = 500;
  const buffer = 4;
  const itemsPerPage = 20;

  const fetchEmployees = async (startIndex) => {
    try {
      const payload = {
        username: "test",
        password: "123456",
        draw: "1",
        start: startIndex.toString(),
        length: itemsPerPage.toString(),
        table: "employee",
        action: "fetch"
      };

      // Native Fetch implementation
      const response = await fetch('https://backend.jotish.in/backend_dev/gettabledata.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      if (result?.TABLE_DATA?.data) {
        const newData = result.TABLE_DATA.data;
        if (newData.length === 0) {
          setHasMore(false);
        } else {
          const formattedData = newData.map(emp => ({
            name: emp[0],
            role: emp[1],
            city: emp[2],
            id: emp[3],
            salary: emp[5]?.replace('$', '').replace(',', '') || "0"
          }));

          setEmployees(prev => [...prev, ...formattedData]);
          setStart(prev => prev + itemsPerPage);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => { fetchEmployees(0); }, []);

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
    if (loadingMore || !hasMore) return;
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      setLoadingMore(true);
      setTimeout(() => fetchEmployees(start), 1000);
    }
  };

  const filteredData = employees.filter(emp => 
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  const endIndex = Math.min(filteredData.length - 1, Math.floor((scrollTop + containerHeight) / itemHeight) + buffer);
  const visibleSlice = filteredData.slice(startIndex, endIndex + 1);

  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101822] min-h-screen">
      <Header changeuser={changeuser} />
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between mb-8">
          <h2 className="text-3xl font-bold dark:text-white">Employee List</h2>
          <input 
            type="text" 
            placeholder="Search..." 
            className="p-2 rounded bg-slate-800 text-white"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border dark:border-slate-800">
          <div onScroll={handleScroll} className="overflow-y-auto" style={{ height: `${containerHeight}px` }}>
            <div style={{ height: `${filteredData.length * itemHeight}px`, position: 'relative' }}>
              <div style={{ transform: `translateY(${startIndex * itemHeight}px)`, position: 'absolute', width: '100%' }}>
                {visibleSlice.map((emp) => (
                  <div key={emp.id} className="grid grid-cols-5 p-6 border-b dark:border-slate-800 items-center">
                    <div className="dark:text-white">{emp.name}</div>
                    <div className="text-slate-500">{emp.city}</div>
                    <div className="text-slate-500">${emp.salary}</div>
                    <div className="text-right col-span-2">
                      <Link to={`/audit/${emp.id}`} className="text-blue-500 font-bold">View Details</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Datafetch;