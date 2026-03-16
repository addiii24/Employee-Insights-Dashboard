# Employee Insights Dashboard

This is a React-based 4-screen Employee Insights Dashboard built without any pre-made component libraries like MUI, Ant Design, or Bootstrap, relying entirely on raw Tailwind CSS for styling. It implements advanced concepts such as Custom Virtualization, native Camera API integration, HTML5 Canvas manipulation, and Geo-Spatial mapping.

## Features Completed
1. **Secure Authentication:** Context API-based login system persisted via `localStorage`. Checks authentication state on route changes.
2. **High-Performance Grid:** Uses custom-written virtualization math to handle the large API dataset exclusively rendering only viewport items.
3. **Identity Verification:** Integrates the native Camera API for identity capture and HTML5 Canvas for drawing and merging a digital signature into a single Blob/Base64 image.
4. **Data Visualization:**
   - Evaluates the merged image (Identity + Signature)
   - Uses **Raw SVG** mathematical drawing to plot Average Salary by City without any external libraries like Chart.js or D3.
   - Interfaces with **Leaflet** to chart geospatial data.

## 🚨 Intentional Vulnerability (Assignment Requirement)
As per the hard constraints of this assignment, there is exactly **one intentional performance/memory-leak logic bug** injected into the application.

**Location:** `src/Pages/Analytics.jsx`
**Description:** A **Stale Closure & Memory Leak** exists inside the `Analytics.jsx` custom graph view component.
```javascript
  useEffect(() => {
    const handleResize = () => {
       console.log("Window resized. Stale Salary Data length:", salaryData.length);
    };
    window.addEventListener('resize', handleResize);
    // INTENTIONAL BUG: Missing cleanup function
    // return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency array locks in the stale `salaryData` state for this closure
```
**Why this is a bug:** 
1. **Memory Leak:** Every time the `Analytics` component unmounts and remounts, a new `resize` event listener is permanently attached to the global `window` object. Over time, this piles up useless listeners that slow down the window resize paints.
2. **Stale Closure:** Because the `useEffect` has an empty dependency array `[]` (missing `salaryData`), the `handleResize` function inside will *always* see the initial, empty state of `salaryData` instead of the fetched data. 

## 🗺️ Geospatial Mapping Strategy
To map the city names returned from the API endpoint `https://backend.jotish.in/backend_dev/gettabledata.php`, we used **Leaflet** alongside a **Static Coordinate Dictionary**.
1. Because the API only returns a string for the City column (e.g., "London", "New York") and not actual Longitude/Latitude values required to place pins on a map, we hardcoded a dictionary mapping the returned city strings to standard lat/long coordinates.
2. During the data parse, we read the `emp[2]` (City) array index, check against the dictionary mapping, and then plot a `<Marker>` on the generic Leaflet `<MapContainer>` using those coordinates.
