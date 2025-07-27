import { useRef, useState } from "react";

const Camera = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [image, setImage] = useState<string | null>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera access error:", err);
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx?.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL("image/png");
        setImage(dataUrl);
    };

    const sendPhoto = async () => {
        if (!image) return;
        const blob = await (await fetch(image)).blob();
        const formData = new FormData();
        formData.append("image", blob, "photo.png");

        await fetch("http://localhost:8000/upload", {
            method: "POST",
            body: formData,
        });

        alert("Photo sent to backend!");
    };

    return (
        <div className="p-4 space-y-4">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: '100%', maxWidth: '400px', border: '1px solid black' }}
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="space-x-2">
                <button onClick={startCamera} className="px-4 py-2 bg-blue-600 text-white rounded">Start Camera</button>
                <button onClick={capturePhoto} className="px-4 py-2 bg-green-600 text-white rounded">Capture</button>
                <button onClick={sendPhoto} className="px-4 py-2 bg-purple-600 text-white rounded">Send to Backend</button>
            </div>
            {image && <img src={image} alt="Captured" style={{ marginTop: '1rem', maxWidth: '400px' }} />}
        </div>
    );
};

export default Camera;
