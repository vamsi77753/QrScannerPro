import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import QrFrame from "../assets/qr-frame.svg";
import "./QrStyles.css";
import { Buffer } from "buffer";

const QrReader = () => {
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);
  const [scannedResult, setScannedResult] = useState<string | undefined>("");

  const onScanSuccess = (result: QrScanner.ScanResult) => {
    console.log(result);
    const decodedData = decodeData(result?.data);
    setScannedResult(decodedData);
  };

  const onScanFail = (err: string | Error) => {
    console.log(err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl?.current || undefined,
      });

      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  // function isBase64(str: string): boolean {
  //   try {
  //     return btoa(atob(str)) === str;
  //   } catch (err) {
  //     return false;
  //   }
  // }

  // function decodeBase64(str: string): string {
  //   return atob(str);
  // }

  // function isHex(str: string): boolean {
  //   return /^[0-9a-fA-F]+$/.test(str);
  // }

  // function decodeHex(str: string): string {
  //   const hex = str.toString();
  //   let decodedStr = "";
  //   for (let i = 0; i < hex.length; i += 2) {
  //     decodedStr += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  //   }
  //   return decodedStr;
  // }

  // function decodeData(data: string): string {
  //   if (isBase64(data)) {
  //     return decodeBase64(data);
  //   } else if (isHex(data)) {
  //     return decodeHex(data);
  //   } else {
  //     return data;
  //   }
  // }

  function isBase64(str: string): boolean {
    try {
      return (
        Buffer.from(Buffer.from(str, "base64").toString("ascii")).toString(
          "base64"
        ) === str
      );
    } catch (err) {
      return false;
    }
  }

  function decodeBase64(str: string): string {
    return Buffer.from(str, "base64").toString("ascii");
  }

  function isHex(str: string): boolean {
    return /^[0-9a-fA-F]+$/.test(str);
  }

  function decodeHex(str: string): string {
    const hex = str.toString();
    let decodedStr = "";
    for (let i = 0; i < hex.length; i += 2) {
      decodedStr += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return decodedStr;
  }

  function decodeData(data: string): string {
    if (isBase64(data)) {
      return decodeBase64(data);
    } else if (isHex(data)) {
      return decodeHex(data);
    } else {
      return data;
    }
  }

  return (
    <div className="qr-reader">
      <video ref={videoEl}></video>
      <div ref={qrBoxEl} className="qr-box">
        <img
          src={QrFrame}
          alt="Qr Frame"
          width={256}
          height={256}
          className="qr-frame"
        />
      </div>
      {scannedResult && (
        <p
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 99999,
            color: "white",
          }}
        >
          Scanned Result: {scannedResult}
        </p>
      )}
    </div>
  );
};

export default QrReader;
