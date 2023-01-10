import { useState } from "react"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import readXlsxFile from "read-excel-file"
import columns from "../columns"

import Loader from "./Loader"

const map: any = {}
columns.map((row: any) => {
    map[row.field] = row.field
})

const SelectFile = ({ onFileLoad, setFileName }: any) => {
    const [fileLoaded, setFileLoaded] = useState(false)

    const handleChange = (e: any) => {
        setFileLoaded(true)
        readXlsxFile(e.target.files[0], { map }).then(({ rows }) => {
            console.log(rows)
            setFileName(e.target.files[0].name)
            if (onFileLoad)
                onFileLoad(
                    rows.map((row: any) => {
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
        })
    }
    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {fileLoaded ? (
                <Loader />
            ) : (
                <Box sx={{ maxWidth: "80%" }}>
                    <Typography variant="body1" gutterBottom textAlign="center">
                        Choose any Excel file (.xlsx) with the following column
                        names
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            <b>lyrics</b> Song Lyrics
                        </Typography>
                        {columns
                            .filter((col: any) => col.edit)
                            .map((column: any, id: number) => (
                                <Typography
                                    variant="subtitle1"
                                    gutterBottom
                                    key={id}
                                >
                                    <b>{column.field}</b> {column.name}
                                </Typography>
                            ))}
                    </Box>
                    <input type="file" onChange={handleChange} />
                </Box>
            )}
        </div>
    )
}

export default SelectFile
