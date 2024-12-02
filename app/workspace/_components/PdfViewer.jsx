import React from 'react'

const PdfViewer = ({fileUrl}) => {
  return (
    <iframe src={fileUrl} className="h-[90vh]" height="90vh" width={"100%"}></iframe>
  )
}

export default PdfViewer