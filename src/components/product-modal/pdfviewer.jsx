import React, { useEffect, useRef } from "react";

// PDF.js CDN link
const PDF_CDN_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js";
const PDF_WORKER_CDN_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";

const PDFViewer = ({ fileUrl }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Load PDF.js from CDN
    const loadPdfJs = async () => {
      const script = document.createElement("script");
      script.src = PDF_CDN_URL;
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_CDN_URL;
        loadPdf(); // Load the PDF after loading the library
      };
      document.body.appendChild(script);
    };

    // Load the PDF using the loaded pdfjsLib
    const loadPdf = async () => {
      const loadingTask = window.pdfjsLib.getDocument(fileUrl);
      const pdf = await loadingTask.promise;

      // Clear the container
      containerRef.current.innerHTML = "";

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);

        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        // Create a canvas element for each page
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        containerRef?.current?.appendChild(canvas);

        // Render the page into the canvas
        const renderContext = {
          canvasContext: context,
          viewport,
        };
        await page.render(renderContext).promise;
      }
    };

    // Load the PDF.js library first
    loadPdfJs();
  }, [fileUrl]);

  return <div ref={containerRef} />;
};

export default PDFViewer;
