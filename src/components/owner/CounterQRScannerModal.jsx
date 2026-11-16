import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, QrCode, CheckCircle2, User, RefreshCw, Volume2, KeyRound } from 'lucide-react';
import { useMess } from '../../context/MessContext';

export const CounterQRScannerModal = () => {
  const { isScannerOpen, setIsScannerOpen, handleCheckInScan, currentTimeIST, addToast } = useMess();
  const [passCode, setPassCode] = useState('#MM-8849');
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);

  // Play audio chime on scan
  const playSuccessChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // AudioContext fallback
    }
  };

  // Start real camera if desired
  useEffect(() => {
    if (cameraActive && isScannerOpen) {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          setCameraActive(false);
          addToast('Camera Notice', 'Real camera unavailable; using high-speed simulation.', 'info');
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive, isScannerOpen, addToast]);

  if (!isScannerOpen) return null;

  const handleExecuteScan = async (codeToVerify) => {
    const code = codeToVerify || passCode;
    setIsScanning(false);
    playSuccessChime();
    const res = await handleCheckInScan(code);
    setScanResult(res.student);
  };

  const handleResetScanner = () => {
    setScanResult(null);
    setIsScanning(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-[420px] w-full p-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Turnstile Counter Scanner
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                TERMINAL 02 • {currentTimeIST}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsScannerOpen(false);
              setScanResult(null);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Box */}
        <div className="my-3">
          {!scanResult ? (
            <div className="relative aspect-square max-w-[260px] mx-auto bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-700 flex flex-col items-center justify-center shadow-inner">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4 z-10">
                  <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-emerald-400/60 mx-auto flex items-center justify-center mb-2">
                    <QrCode className="w-7 h-7 text-emerald-400/80" />
                  </div>
                  <p className="text-xs font-mono text-emerald-400 font-medium">
                    AWAITING PASS
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Align student QR inside viewfinder
                  </p>
                </div>
              )}

              {/* Viewfinder Corner Brackets */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-sm pointer-events-none" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-sm pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-sm pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-sm pointer-events-none" />

              {/* Animated Laser Scanning Line */}
              <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#34D399] animate-scan-line pointer-events-none" />
            </div>
          ) : (
            /* Successful Scan Verification Card */
            <div className="bg-[#F0FDF4] border-2 border-[#16A34A] rounded-2xl p-4 text-center animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-[#16A34A] text-white mx-auto flex items-center justify-center mb-2 shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <span className="bg-[#DCFCE7] text-[#15803D] text-[11px] font-bold font-mono px-2 py-0.5 rounded uppercase">
                ENTRY AUTHORIZED ✓
              </span>
              <h4 className="font-extrabold text-base text-slate-900 mt-2">
                {scanResult.name}
              </h4>
              <p className="text-xs font-mono text-slate-600">
                {scanResult.rollNo} • {scanResult.room || 'Room 304'}
              </p>

              <div className="bg-white border border-emerald-100 rounded-xl p-2.5 mt-3 text-left space-y-1 text-xs">
                <div className="flex justify-between font-mono text-slate-600 text-[11px]">
                  <span>Pass Token:</span>
                  <span className="font-bold text-slate-900">{scanResult.qrCodeId || passCode}</span>
                </div>
                <div className="flex justify-between font-mono text-slate-600 text-[11px]">
                  <span>Subscription:</span>
                  <span className="font-semibold text-emerald-700">Monthly Veg</span>
                </div>
                <div className="flex justify-between font-mono text-slate-600 text-[11px]">
                  <span>Gate Turnstile:</span>
                  <span className="text-slate-900">Hall A - Turnstile 02</span>
                </div>
                <div className="flex justify-between font-mono text-slate-600 text-[11px]">
                  <span>Database Synced:</span>
                  <span className="text-[#16A34A] font-semibold">meal_logs updated</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="space-y-2.5">
          {!scanResult ? (
            <>
              {/* Manual Pass Code Input Box */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold mb-1">
                  Pass Code / QR Token
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      value={passCode}
                      onChange={(e) => setPassCode(e.target.value)}
                      placeholder="#MM-8849"
                      className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-8 pr-2.5 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleExecuteScan(passCode)}
                    className="bg-[#0F172A] hover:bg-black text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-xs"
                  >
                    Check In
                  </button>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex gap-1.5 pt-0.5">
                {['#MM-8849', '#MM-1120', '#MM-2080'].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setPassCode(code);
                      handleExecuteScan(code);
                    }}
                    className={`flex-1 text-[11px] font-mono py-1 rounded-lg border transition-colors cursor-pointer ${
                      passCode === code
                        ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>

              {/* Physical Camera Toggle */}
              <button
                type="button"
                onClick={() => setCameraActive(!cameraActive)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-1"
              >
                <Camera className="w-3.5 h-3.5 text-slate-600" />
                <span>{cameraActive ? 'Turn Off Physical Camera' : 'Use Device Camera Stream'}</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleResetScanner}
              className="w-full bg-[#0F172A] hover:bg-black text-white font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Scan Next Student Pass</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
