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
import ResetWarning from "./components/ResetWarning"
import Footer from "./components/Footer"

function App() {
    const [fileLoaded, setFileLoaded] = useState(false)
    const [fileName, setFileName] = useState("")
    const [data, setData] = useState([])
    const [exportModal, setExportModal] = useState(false)
    const [currentSong, setCurrentSong] = useState(0)
    const [resetWarning, setResetWarning] = useState(false)

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

    const handleExport = async ({
        removed = true,
        selected = false,
        type = "xlxs",
    }) => {
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
        if (type === "xlxs") {
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
        } else {
            dataArray = dataArray.map((data: any) => {
                const metaphors = []
                for (let i = 1; i < 6; i++) {
                    if (data[`metaphor_${i}`]) {
                        // if (data[`metaphor_${i}_meaning`]) {
                        //     metaphors.push({
                        //         metaphor: data[`metaphor_${i}`],
                        //         target: data[`metaphor_${i}_meaning`],
                        //         source: "",
                        //         interpretation: "",
                        //     })
                        // } else {
                        metaphors.push({
                            metaphor: data[`metaphor_${i}`],
                            target: data[`metaphor_${i}_target`] || "",
                            source: data[`metaphor_${i}_source`] || "",
                            interpretation:
                                data[`metaphor_${i}_interpretation`] || "",
                        })
                        // }
                    }
                }
                const finalData: any = {}
                columns
                    .filter((col: any) => col.jsonExport)
                    .forEach((col: any) => {
                        finalData[col.field] = data[col.field]
                    })
                finalData.metaphors = metaphors
                return finalData
            })

            // const blob = new Blob([JSON.stringify(dataArray, undefined, 2)], {
            //     type: "text/json",
            // })
            const blob = new Blob(
                [
                    dataArray
                        .map(
                            (data: any) =>
                                '{"index": {"_index": "lyrics-test"}}\n' +
                                JSON.stringify(data)
                        )
                        .join("\n") + "\n",
                ],
                {
                    type: "text/json",
                }
            )
            const link = document.createElement("a")

            link.download = fileName.split(".xlsx")[0] + "-modified" + ".json"
            link.href = window.URL.createObjectURL(blob)
            link.dataset.downloadurl = [
                "text/json",
                link.download,
                link.href,
            ].join(":")

            const evt = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: true,
            })

            link.dispatchEvent(evt)
            link.remove()
        }
    }

    const handleSaveLocal = (data: any, currentSong: number) => {
        localStorage.setItem(
            "savedItems",
            JSON.stringify({ fileName, data, currentSong })
        )
    }

    const handleResetClick = () => {
        setResetWarning(true)
    }

    const handleResetClose = () => {
        setResetWarning(false)
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
        <>
            <div className="app-container">
                {fileLoaded ? (
                    <FileViewer
                        data={data}
                        setData={setData}
                        onExport={handleExportClick}
                        handleSaveLocal={handleSaveLocal}
                        handleReset={handleResetClick}
                        currentSong={currentSong}
                        setCurrentSong={setCurrentSong}
                    />
                ) : (
                    <SelectFile
                        onFileLoad={onFileLoad}
                        setFileName={setFileName}
                    />
                )}
                <ExportPrompt
                    open={exportModal}
                    handleClose={handleClose}
                    onExport={handleExport}
                />
                <ResetWarning
                    open={resetWarning}
                    handleClose={handleResetClose}
                    onAccept={handleReset}
                />
            </div>
            <Footer />
        </>
    )
}

export default App
