import React from "react";

import FileList from "./components/FileListViewer.tsx";
import FileUploader from "./components/FileUploader.tsx";
import Layout from "./components/@common/Layout.tsx";

const App = () => {
  return (
    <Layout>
      <FileUploader />
      <h1 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Files</h1>
      <FileList />
    </Layout>
  );
};

export default App;
