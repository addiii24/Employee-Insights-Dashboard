import React, { useState, useEffect, useRef } from 'react';
import Header from '../Others/Header.jsx';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Hardcoded City to Coordinate Mapping 
// Used since the API returns strings for cities (e.g. "New York", "London")
const CITY_COORDINATES = {
  "New York": [40.7128, -74.0060],
  "London": [51.5074, -0.1278],
  "San Francisco": [37.7749, -122.4194],
  "Tokyo": [35.6762, 139.6503],
  "Sydney": [-33.8688, 151.2093],
  "Edinburgh": [55.9533, -3.1883],
  "Singapore": [1.3521, 103.8198]
};

const Analytics = ({ changeuser }) => {
  const [auditImage, setAuditImage] = useState(null);
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Intentional Bug: Stale Closure / Memory Leak
  // We attach a resize listener but never clean it up. Also, it uses a stale
  // reference to the initial `salaryData` array if we tried to log it here.
  useEffect(() => {
    const handleResize = () => {
       console.log("Window resized. Stale Salary Data length:", salaryData.length);
    };
    window.addEventListener('resize', handleResize);
    // INTENTIONAL BUG: Missing cleanup function -> `return () => window.removeEventListener('resize', handleResize);`
  }, []); // Empty dependency array locks in the stale `salaryData` state for this closure

  useEffect(() => {
    // 1. Fetch the merged Audit Image from localStorage
    const savedImage = localStorage.getItem('auditImage');
    if (savedImage) setAuditImage(savedImage);

    // 2. Fetch data for charts
    const fetchAnalyticsData = async () => {
      try {
        const payload = {
          username: "test",
          password: "123456",
          draw: "1",
          start: "0",
          length: "100", // grab a good chunk for distribution
          table: "employee",
          action: "fetch"
        };
        const response = await fetch('https://backend.jotish.in/backend_dev/gettabledata.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (result?.TABLE_DATA?.data) {
          const newData = result.TABLE_DATA.data;
          
          // Group salaries by City
          const cityMap = {};
          newData.forEach(emp => {
            const city = emp[2];
            const salaryStr = emp[5]?.replace('$', '').replace(',', '') || "0";
            const salary = parseInt(salaryStr, 10);
            
            if (!cityMap[city]) cityMap[city] = { totalSalary: 0, count: 0 };
            cityMap[city].totalSalary += salary;
            cityMap[city].count += 1;
          });

          // Convert to array format for SVG Chart
          const groupedData = Object.keys(cityMap).map(city => ({
            city,
            avgSalary: Math.round(cityMap[city].totalSalary / cityMap[city].count)
          }));
          
          setSalaryData(groupedData);
        }
      } catch (err) {
        console.error("Error fetching analytics data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // For the custom SVG chart math
  const maxSalary = Math.max(...salaryData.map(d => d.avgSalary), 1);
  const chartHeight = 300;
  const chartWidth = 600;
  const barWidth = 40;
  const barSpacing = chartWidth / (salaryData.length || 1);

  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101822] min-h-screen text-slate-900 dark:text-white pb-10">
      <Header changeuser={changeuser} />
      
      <main className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Section 1: Final Audit Image */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Audit Result</h2>
          <div className="flex-grow flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 min-h-[300px]">
            {auditImage ? (
              <img src={auditImage} alt="Completed Audit" className="max-w-full max-h-[400px] object-contain" />
            ) : (
              <p className="text-slate-500">No audit image found.</p>
            )}
          </div>
        </section>

        {/* Section 2: Geospatial Mapping */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-4">City Distribution Map</h2>
          <div className="h-[400px] w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 relative z-0">
            {/* The leaflet map container needs to have z-index < Header */}
            <MapContainer center={[30, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {salaryData.map((data, index) => {
                const coords = CITY_COORDINATES[data.city];
                if (!coords) return null; // Skip if city isn't in our hardcoded map
                return (
                  <Marker key={index} position={coords}>
                    <Popup>
                      <strong>{data.city}</strong><br/>
                      Avg Salary: ${data.avgSalary.toLocaleString()}
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </section>

        {/* Section 3: Custom SVG Chart */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 p-6 lg:col-span-2 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4">Average Salary by City (Raw SVG)</h2>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center text-slate-500">Loading chart data...</div>
          ) : (
            <div className="min-w-[600px] flex justify-center">
              <svg width={chartWidth} height={chartHeight + 40} className="w-full max-w-3xl">
                {/* Y Axis line */}
                <line x1="40" y1="0" x2="40" y2={chartHeight} stroke="currentColor" strokeWidth="2" />
                {/* X Axis line */}
                <line x1="40" y1={chartHeight} x2={chartWidth + 40} y2={chartHeight} stroke="currentColor" strokeWidth="2" />
                
                {salaryData.map((data, index) => {
                  // Calculate raw height proportionately
                  const barHeight = (data.avgSalary / maxSalary) * (chartHeight - 40);
                  const x = 60 + (index * barSpacing);
                  const y = chartHeight - barHeight;

                  return (
                    <g key={index} className="group">
                      {/* Interactive Bar */}
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        fill="#3b82f6"
                        className="transition-all duration-300 hover:fill-blue-400 cursor-pointer"
                      />
                      
                      {/* Tooltip text shown on hover via CSS group */}
                      <text
                        x={x + barWidth / 2}
                        y={y - 10}
                        textAnchor="middle"
                        fill="currentColor"
                        className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ${data.avgSalary.toLocaleString()}
                      </text>

                      {/* X-Axis labels */}
                      <text
                        x={x + barWidth / 2}
                        y={chartHeight + 20}
                        textAnchor="middle"
                        fill="currentColor"
                        className="text-xs"
                      >
                        {data.city.length > 8 ? data.city.substring(0,8) + '...' : data.city}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Analytics;