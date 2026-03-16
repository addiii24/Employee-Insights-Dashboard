import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import Header from '../Others/Header.jsx';

const Audit = () => {
  const { id } = useParams();
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
      alert("Camera access denied or not found.");
    }
  };

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    setCapturedImg(canvas.toDataURL('image/jpeg'));
    
    const stream = videoRef.current.srcObject;
    stream.getTracks().forEach(track => track.stop());
    setIsCameraOpen(false);
  };

  const handleMergeAndUpload = () => {
    const mainCanvas = document.createElement('canvas');
    const ctx = mainCanvas.getContext('2d');
    const photo = new Image();
    
    photo.src = capturedImg;
    photo.onload = () => {
      mainCanvas.width = photo.width;
      mainCanvas.height = photo.height;
      ctx.drawImage(photo, 0, 0);
      
      const sigImg = new Image();
      sigImg.src = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
      
      sigImg.onload = () => {
        // Overlay signature
        ctx.drawImage(sigImg, mainCanvas.width - 250, mainCanvas.height - 150, 200, 100);
        const mergedData = mainCanvas.toDataURL('image/jpeg', 0.8);
        uploadAuditData(mergedData);
      };
    };
  };

  // REPLACED AXIOS WITH NATIVE FETCH
  const uploadAuditData = async (base64Image) => {
    const payload = {
      username: "test",
      password: "123456",
      employee_id: id,
      audit_image: base64Image
    };

    try {
      const response = await fetch('https://backend.jotish.in/backend_dev/gettabledata.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Audit Successful!");
      } else {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
      }
    } catch (err) {
      console.error("Network Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#101822] text-white">
      <Header />
      <div className="max-w-4xl mx-auto p-10">
        <h2 className="text-3xl font-bold mb-8">Audit Verification</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Photo Capture */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            {!capturedImg ? (
              <>
                <video ref={videoRef} autoPlay className="w-full rounded-lg bg-black mb-4" />
                <button onClick={isCameraOpen ? capturePhoto : startCamera} className="w-full py-3 bg-blue-600 rounded-xl font-bold">
                  {isCameraOpen ? "Capture Photo" : "Start Camera"}
                </button>
              </>
            ) : (
              <img src={capturedImg} className="w-full rounded-lg border border-blue-500" alt="Captured" />
            )}
          </div>

          {/* Signature & Merge */}
          <div className={`bg-slate-900 p-6 rounded-2xl border border-slate-800 ${!capturedImg && 'opacity-30'}`}>
            <div className="bg-white rounded-lg mb-4">
              <SignatureCanvas 
                ref={sigPad}
                penColor='black'
                canvasProps={{ className: 'w-full h-48' }} 
              />
            </div>
            <button onClick={handleMergeAndUpload} disabled={!capturedImg} className="w-full py-3 bg-indigo-600 rounded-xl font-bold">
              Finalize & Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audit;