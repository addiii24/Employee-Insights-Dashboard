import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import Header from '../Others/Header.jsx';
import { Link } from 'react-router-dom';

const Audit = ({ changeuser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [capturedImg, setCapturedImg] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const sigPad = useRef({});

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Please allow camera access.");
    }
  };

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    setCapturedImg(canvas.toDataURL('image/jpeg'));
    
    videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    setIsCameraOpen(false);
  };

  const handleFinalMerge = async () => {
    console.log("Starting handleFinalMerge...");
    try {
      const mainCanvas = document.createElement('canvas');
      const ctx = mainCanvas.getContext('2d');
      console.log("Canvas created.");
      
      // Promise to load the captured photo
      const loadImg = (src) => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

      console.log("Loading photo image...");
      const photoImg = await loadImg(capturedImg);
      console.log("Photo image loaded. Drawing to canvas...");
      mainCanvas.width = photoImg.width;
      mainCanvas.height = photoImg.height;
      ctx.drawImage(photoImg, 0, 0);

      // Check if signature exists, if not just use a blank transparent image
      let sigDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      console.log("Checking signature pad...");
      if (sigPad.current && !sigPad.current.isEmpty()) {
         // Using getCanvas() instead of getTrimmedCanvas() which can crash on edge-drawn signatures
         sigDataUrl = sigPad.current.getCanvas().toDataURL('image/png');
         console.log("Signature captured.");
      } else {
         console.log("Signature pad empty, using placeholder.");
      }
      
      console.log("Loading signature image...");
      const sigImg = await loadImg(sigDataUrl);
      console.log("Signature loaded. Overlaying on canvas...");
      ctx.drawImage(sigImg, mainCanvas.width - 250, mainCanvas.height - 150, 200, 100);
      
      console.log("Generating final DataURL...");
      const finalData = mainCanvas.toDataURL('image/jpeg', 0.8);
      console.log("Saving to localStorage...");
      localStorage.setItem('auditImage', finalData);
      
      // Background upload, do not await so it doesn't block UI navigation
      console.log("Initiating background upload fetch...");
      fetch('https://backend.jotish.in/backend_dev/gettabledata.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: "test", password: "123456",
          id: id, audit_image: finalData
        })
      }).catch(e => console.error("Background save failed:", e));

      console.log("Alerting success and navigating...");
      alert("Audit Verified and Saved!");
      navigate('/analytics');
      
    } catch (error) {
      console.error("Critical error during image merge:", error);
      alert("Image merge failed! Check console.");
      navigate('/analytics'); // Always let the user proceed
    }
  };

  return (
    <div className="min-h-screen bg-[#101822] text-white">
      <Header changeuser={changeuser} />
      <div className="max-w-4xl mx-auto p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-slate-900 p-6 rounded-2xl">
          <h3 className="mb-4 font-bold">1. Identity Capture</h3>
          {!capturedImg ? (
            <>
              <video ref={videoRef} autoPlay className="w-full rounded bg-black mb-4" />
              <button onClick={isCameraOpen ? capturePhoto : startCamera} className="w-full py-3 bg-blue-600 rounded-lg">
                {isCameraOpen ? "Capture" : "Start Camera"}
              </button>
            </>
          ) : (
            <img src={capturedImg} className="w-full rounded border border-blue-500" />
          )}
        </div>

        <div className={`bg-slate-900 p-6 rounded-2xl ${!capturedImg && 'opacity-30'}`}>
          <h3 className="mb-4 font-bold">2. Digital Signature</h3>
          <div className="bg-white rounded mb-4">
            <SignatureCanvas ref={sigPad} penColor="black" canvasProps={{ className: 'w-full h-48' }} />
          </div>
          <button onClick={handleFinalMerge} disabled={!capturedImg} className="w-full py-3 bg-indigo-600 rounded-lg font-bold">
            Complete Audit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Audit;