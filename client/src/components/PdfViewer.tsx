import React, { useEffect, useState, useRef, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function PdfViewer({ url }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [pdfRef, setPdfRef] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  const renderPage = useCallback(
    (pageNum, pdf = pdfRef) => {
      if (pdf) {
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        pdf.getPage(pageNum).then((page) => {
          const viewport = page.getViewport({ scale: 1 });
          const canvas = canvasRef.current;

          if (!canvas) {
            return;
          }

          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          if (!context) {
            return;
          }

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          // Start the render task
          renderTaskRef.current = page.render(renderContext);
          renderTaskRef.current.promise.then(
            () => {
              renderTaskRef.current = null;
            },
            (error) => {
              if (error.name === "RenderingCancelledException") {
                console.log("Render cancelled");
              } else {
                console.error("Page render error:", error);
              }
              renderTaskRef.current = null;
            }
          );
        });
      }
    },
    [pdfRef]
  );

  useEffect(() => {
    renderPage(currentPage, pdfRef);
  }, [pdfRef, currentPage, renderPage]);

  useEffect(() => {
    const loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(
      (loadedPdf) => {
        setPdfRef(loadedPdf);
      },
      function (reason) {
        console.error(reason);
      }
    );
  }, [url]);

  const nextPage = () =>
    pdfRef && currentPage < pdfRef.numPages && setCurrentPage(currentPage + 1);

  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="w-1/2 h-full flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <canvas ref={canvasRef} className="max-h-full"></canvas>
      </div>
      <div className="mb-2 flex justify-center">
        <button
          onClick={prevPage}
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Previous
        </button>
        <button
          onClick={nextPage}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
