import { useState, useEffect } from "react"
import "./App.css"
import SelectFile from "./components/SelectFile"
import FileViewer from "./components/FileViewer"
import writeXlsxFile from "write-excel-file"
import columns from "./columns"

import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import ExportPrompt from "./components/ExportPrompt"

function App() {
    const [fileLoaded, setFileLoaded] = useState(false)
    const [fileName, setFileName] = useState("")
    const [data, setData] = useState([])
    const [exportModal, setExportModal] = useState(false)
    const [currentSong, setCurrentSong] = useState(0)

    const onFileLoad = (data: any) => {
        setFileLoaded(true)
        setData(data)
    }

    const handleExportClick = () => {
        setExportModal(true)
    }

    const handleClose = () => {
        setExportModal(false)
    }

    const handleExport = async ({ removed = true, selected = false }) => {
        console.log("exporting")
        const headerRow = columns.map((col: any) => ({
            fontWeight: "bold",
            value: col.field,
        }))
        let dataArray: any = [...data]
        if (selected) {
            dataArray = dataArray.filter((row: any) => row.selected)
        }
        if (removed) {
            dataArray = dataArray.filter((row: any) => !row.removed)
        }
        dataArray = dataArray.map((row: any) => {
            return columns.map((col: any) => ({
                type: String,
                value: row[col.field]?.toString() || "",
            }))
        })
        // @ts-ignore: Unreachable code error
        await writeXlsxFile([headerRow, ...dataArray], {
            fileName: fileName.split(".xlsx")[0] + "-modified" + ".xlsx",
        })
    }

    const handleSaveLocal = (data: any, currentSong: number) => {
        localStorage.setItem(
            "savedItems",
            JSON.stringify({ fileName, data, currentSong })
        )
    }

    const handleReset = () => {
        localStorage.removeItem("savedItems")
        setFileLoaded(false)
        setFileName("")
        setData([])
    }

    useEffect(() => {
        const savedItems = localStorage.getItem("savedItems")
        if (savedItems) {
            try {
                const parsed = JSON.parse(savedItems)
                if (parsed.data.length) {
                    setData(
                        parsed.data.map((row: any) => {
                            if (row.metaphor) {
                                row.metaphor
                                    .split("\n\n")
                                    .map((old: string, id: number) => {
                                        row[`metaphor_${id + 1}`] = old
                                    })
                                row.metaphor = ""
                            }
                            for (let i = 1; i < 6; i++) {
                                if (row[`metaphor_${i}_meaning`]) {
                                    row[`metaphor_${i}_source`] =
                                        row[`metaphor_${i}_meaning`]
                                }
                            }
                            return row
                        })
                    )
                    setFileName(parsed.fileName)
                    setCurrentSong(parsed.currentSong || 0)
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
            {fileLoaded ? (
                <FileViewer
                    data={data}
                    setData={setData}
                    onExport={handleExportClick}
                    handleSaveLocal={handleSaveLocal}
                    handleReset={handleReset}
                    currentSong={currentSong}
                    setCurrentSong={setCurrentSong}
                />
            ) : (
                <SelectFile onFileLoad={onFileLoad} setFileName={setFileName} />
            )}
            <ExportPrompt
                open={exportModal}
                handleClose={handleClose}
                onExport={handleExport}
            />
        </div>
    )
}

export default App
