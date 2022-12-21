import { useState, useEffect } from 'react'
import './App.css'
import SelectFile from './components/SelectFile'
import FileViewer from './components/FileViewer';
import writeXlsxFile from 'write-excel-file'
import columns from './columns'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  const [fileLoaded, setFileLoaded] = useState(false);
  const [fileName, setFileName] = useState("")
  const [data, setData] = useState([])

  const onFileLoad = (data: any) => {
    setFileLoaded(true)
    setData(data)
  }

  const handleExport = async () => {
    console.log('exporting')
    const headerRow = columns.map((col:any)=>({
      fontWeight: 'bold',
      value: col.field
    }))
    const dataArray = data.filter((row: any)=>!row.removed).map((row: any)=>{
      return columns.map((col:any)=>({
        type: String,
        value: row[col.field]
      }))
    })
    // @ts-ignore: Unreachable code error
    await writeXlsxFile([headerRow, ...dataArray], {
      fileName: fileName.split(".xlsx")[0]+"-modified"+".xlsx"
    })
  }

  const handleSaveLocal = () => {
    localStorage.setItem("savedItems", JSON.stringify({fileName, data}))
  }

  const handleReset = () => {
    localStorage.removeItem("savedItems")
    setFileLoaded(false)
    setFileName("")
    setData([])
  }

  useEffect(()=>{
    const savedItems = localStorage.getItem("savedItems")
    if (savedItems) {
      try {
        const parsed = JSON.parse(savedItems)
        if (parsed.data.length) {
          setData(parsed.data.map((row: any)=>{
            if (row.metaphor) {
                row.metaphor.split("\n\n").map((old: string, id: number)=>{
                    row[`metaphor_${id+1}`]= old
                })
                row.metaphor = ""
            }
            return row
        }))
          setFileName(parsed.fileName)
          setFileLoaded(true)

        }
      } catch {
        console.log("Error")
      }
    }

    // return () => {
    //   handleSaveLocal()
    // }
  }, [])

  return (
    <div className="container">
      {fileLoaded? <FileViewer data={data} setData={setData} onExport={handleExport} handleSaveLocal={handleSaveLocal} handleReset={handleReset} />:
        <SelectFile onFileLoad={onFileLoad} setFileName={setFileName} />
      }
    </div>
  )
}

export default App
