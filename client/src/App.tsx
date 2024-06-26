import React from "react";

import FileList from "./components/FileListViewer.tsx";
import FileUploader from "./components/FileUploader.tsx";

const App = () => {
  return (
    <div>
      <FileUploader />
      <FileList />
    </div>
  );
};

export default App;
