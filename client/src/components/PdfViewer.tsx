import React, { useRef, useEffect, useState, useCallback } from "react";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfViewer({ url }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [pdfRef, setPdfRef] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const renderTaskRef = useRef<pdfjs.RenderTask | null>(null);

  const renderPage = useCallback(
    (pageNum, pdf = pdfRef) => {
      if (pdf) {
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
          renderTaskRef.current.promise.catch(() => {});
        }

        pdf.getPage(pageNum).then(
          (page) => {
            const viewport = page.getViewport({ scale: 1 });
            const canvas = canvasRef.current;
            const container = containerRef.current;

            if (!canvas || !container) {
              return;
            }

            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            const scale = Math.min(
              containerWidth / viewport.width,
              containerHeight / viewport.height
            );

            const scaledViewport = page.getViewport({ scale });

            const context = canvas.getContext("2d");

            canvas.height = scaledViewport.height;
            canvas.width = scaledViewport.width;

            if (!context) {
              return;
            }

            const renderContext = {
              canvasContext: context,
              viewport: scaledViewport,
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
                  // setError("PDF 페이지를 렌더링하는 중에 오류가 발생했습니다.");
                }
                renderTaskRef.current = null;
              }
            );
          },
          (error) => {
            console.error("Page get error:", error);
            setError("PDF 페이지를 불러오는 중에 오류가 발생했습니다.");
          }
        );
      }
    },
    [pdfRef]
  );

  const loadPdf = useCallback(() => {
    const loadingTask = pdfjs.getDocument(url);
    loadingTask.promise.then(
      (loadedPdf) => {
        setPdfRef(loadedPdf);
        setError(null); // Clear any previous errors
      },
      (reason) => {
        console.error(reason);
        setError("PDF를 불러올 수 없습니다."); // Set error message
      }
    );
  }, [url]);

  useEffect(() => {
    if (!pdfRef) return;
    renderPage(currentPage, pdfRef);
  }, [pdfRef, currentPage, renderPage]);

  useEffect(() => {
    loadPdf();
  }, [loadPdf]);

  const nextPage = () =>
    pdfRef && currentPage < pdfRef.numPages && setCurrentPage(currentPage + 1);

  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      ref={containerRef}
    >
      {error ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={loadPdf} // Reload the PDF when clicking the retry button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            다시 시도
          </button>
        </div>
      ) : (
        <>
          <div className="flex-grow flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} className="max-h-full"></canvas>
          </div>
          <div className="h-12 flex justify-center">
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
        </>
      )}
    </div>
  );
}
