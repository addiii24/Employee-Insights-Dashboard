import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import Header from '../Others/Header.jsx';

const Audit = ({ changeuser }) => {
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