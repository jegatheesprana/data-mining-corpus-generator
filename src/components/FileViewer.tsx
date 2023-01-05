import { useState, useEffect, useRef } from "react"
import columns from "../columns"
import MetaDataEditor from "./MetaDataEditor"

import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Stack from "@mui/material/Stack"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import IconButton from "@mui/material/IconButton"
import CardContent from "@mui/material/CardContent"
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip"
import Snackbar from "@mui/material/Snackbar"
import CloseIcon from "@mui/icons-material/Close"
import Typography from "@mui/material/Typography"

import DeleteIcon from "@mui/icons-material/Delete"

// @ts-ignore: Unreachable code error
const HtmlTooltip = styled(({ className, ...props }) => (
    // @ts-ignore: Unreachable code error
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#f5f5f9",
        color: "rgba(0, 0, 0, 0.87)",
        maxWidth: 420,
        fontSize: theme.typography.pxToRem(12),
        border: "1px solid #dadde9",
    },
}))

const FileViewer = ({
    data,
    setData,
    onExport,
    handleSaveLocal,
    handleReset,
    currentSong,
    setCurrentSong,
}: any) => {
    const [lyrics, setLyrics] = useState("")
    const [metaphors, setMetaphors] = useState([{ metaphor: "", meaning: "" }])
    const [edited, setEdited] = useState(false)
    const [selection, setSelection] = useState("")
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState("")

    const lyricsRef = useRef(null)
    const metaphorRef = useRef(null)

    const handleCloseSnackbar = (event: any, reason: any) => {
        if (reason === "clickaway") {
            return
        }

        setOpen(false)
    }

    const action = (
        <>
            {/* @ts-ignore: Unreachable code error */}
            <Button
                color="secondary"
                size="small"
                onClick={handleCloseSnackbar}
            >
                UNDO
            </Button>
            {/* @ts-ignore: Unreachable code error */}
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseSnackbar}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </>
    )

    const handleSongChange = (newSong: any) => {
        if (0 <= newSong && newSong < data.length) {
            handleSave()
            setCurrentSong(newSong)
        }
    }

    const handleLyrisChange = (e: any) => {
        setLyrics(e.target.value)
        setEdited(true)
    }

    const handleMetaphorChange = (id: number, type: string, e: any) => {
        setMetaphors((metaphors: any) => {
            const newMeta = [...metaphors]
            newMeta[id][type] = e.target.value
            return newMeta
        })
        setEdited(true)
    }

    const handleSave = () => {
        const newData = [...data]
        const changedSong = { ...data[currentSong] }
        changedSong.lyrics = lyrics

        metaphors.forEach((meta, id) => {})
        for (let i = 1; i < 6; i++) {
            const meta = metaphors[i - 1]
            changedSong[`metaphor_${i}`] = meta?.metaphor || ""
            changedSong[`metaphor_${i}_meaning`] = meta?.meaning || ""
        }

        newData[currentSong] = changedSong
        setData(newData)

        // if (edited) {
        //     setMessage("Saved")
        //     setOpen(true)
        // }

        // setEdited(false)
        return newData
    }

    const handleSaveProject = () => {
        handleSaveLocal(handleSave(), currentSong)
        setEdited(false)
        setMessage("Saved")
        setOpen(true)
    }

    const handleRemove = () => {
        setData((data: any) => {
            const newData = [...data]
            newData[currentSong] = {
                ...newData[currentSong],
                removed: !newData[currentSong].removed,
            }
            return newData
        })
        setEdited(true)
    }

    const handleSelect = () => {
        setData((data: any) => {
            const newData = [...data]
            newData[currentSong] = {
                ...newData[currentSong],
                selected: !newData[currentSong].selected,
            }
            return newData
        })
        setEdited(true)
    }

    const handleSaveMeta = (meta: any) => {
        setData((data: any) => {
            const newData = [...data]
            newData[currentSong] = meta
            return newData
        })
    }

    const handleAddMetaphor = () => {
        if (metaphors.length < 5) {
            setMetaphors((metaphors) => [
                ...metaphors,
                { metaphor: "", meaning: "" },
            ])
        } else {
            setMessage("Max metaphor is 5")
            setOpen(true)
        }
    }

    const handleRemoveMetaphor = (id: number) => {
        setMetaphors((metaphors) => {
            const newMeta = [...metaphors]
            newMeta.splice(id, 1)
            if (!newMeta.length) {
                newMeta.push({ metaphor: "", meaning: "" })
            }
            return newMeta
        })
    }

    const handleSelectLyrics = (e: any) => {
        let textarea = e.target
        let selection = textarea.value.substring(
            textarea.selectionStart,
            textarea.selectionEnd
        )
        setSelection(selection.replace(/\s\s+/g, " "))
    }

    const handleCreate = () => {
        if (
            !metaphors[metaphors.length - 1].metaphor &&
            !metaphors[metaphors.length - 1].meaning
        ) {
            setMetaphors((metaphors) => {
                const newMeta = [...metaphors]
                newMeta[newMeta.length - 1] = {
                    metaphor: selection,
                    meaning: "",
                }
                return newMeta
            })
        } else {
            if (metaphors.length < 5) {
                setMetaphors((metaphors) => {
                    const newMeta = [...metaphors]
                    newMeta[newMeta.length] = {
                        metaphor: selection,
                        meaning: "",
                    }
                    return newMeta
                })
            } else {
                setMessage("Max metaphor is 5")
                setOpen(true)
            }
        }
        setEdited(true)
        setSelection("")
    }

    useEffect(() => {
        setLyrics(data[currentSong].lyrics || "")
        const metaphors = []
        for (let i = 1; i < 6; i++) {
            if (data[currentSong][`metaphor_${i}`]) {
                metaphors.push({
                    metaphor: data[currentSong][`metaphor_${i}`],
                    meaning: data[currentSong][`metaphor_${i}_meaning`],
                })
            }
        }
        if (metaphors.length) {
            setMetaphors(metaphors)
        } else {
            setMetaphors([{ metaphor: "", meaning: "" }])
        }

        setSelection("")

        // @ts-ignore: Unreachable code error
        lyricsRef.current.scrollTop = 0
        // @ts-ignore: Unreachable code error
        metaphorRef.current.scrollTop = 0
    }, [currentSong])

    return (
        <Container sx={{ minHeight: "100vh" }}>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={message}
                action={action}
            />
            <Box sx={{ flexGrow: 1, mt: 2 }}>
                <Grid container spacing={2}>
                    <Grid
                        item
                        xs={1}
                        sx={{ display: "flex", alignItems: "center" }}
                    >
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handleSongChange(currentSong - 1)}
                            disabled={currentSong === 0}
                        >
                            Previous
                        </Button>
                    </Grid>
                    <Grid
                        item
                        xs={5}
                        sx={{ display: "flex", alignItems: "center" }}
                    >
                        {/* @ts-ignore: Unreachable code error */}
                        <HtmlTooltip
                            title={
                                <>
                                    {columns
                                        .filter((col: any) => col.edit)
                                        .map((column: any) => (
                                            <Typography
                                                color="inherit"
                                                key={column.field}
                                            >{`${column.name}: ${
                                                data[currentSong][column.field]
                                            }`}</Typography>
                                        ))}
                                </>
                            }
                        >
                            <div>
                                <span>{currentSong + 1 + ". "}</span>
                                &nbsp;
                                <a
                                    href={data[currentSong].lyrics_link}
                                    target="_blank"
                                >
                                    {data[currentSong].song_name}
                                </a>
                            </div>
                        </HtmlTooltip>
                    </Grid>
                    <Grid
                        item
                        xs={5}
                        sx={{ display: "flex", alignItems: "center" }}
                    >
                        <TextField
                            id="outlined-select-currency"
                            select
                            label="Song"
                            value={currentSong}
                            onChange={(e) => handleSongChange(e.target.value)}
                            fullWidth
                            variant="standard"
                        >
                            {data.map((row: any, id: any) => (
                                <MenuItem
                                    key={id}
                                    value={id}
                                    sx={
                                        row.selected
                                            ? (theme) => ({
                                                  borderLeft: `5px solid ${theme.palette.primary.main}`,
                                              })
                                            : { ml: "5px" }
                                    }
                                >
                                    {id + 1 + ". " + row.song_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid
                        item
                        xs={1}
                        sx={{ display: "flex", alignItems: "center" }}
                    >
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handleSongChange(currentSong + 1)}
                            disabled={currentSong === data.length - 1}
                        >
                            Next
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Button
                                    variant={
                                        data[currentSong].removed
                                            ? "contained"
                                            : "outlined"
                                    }
                                    fullWidth
                                    onClick={handleRemove}
                                >
                                    {data[currentSong].removed
                                        ? "Removed"
                                        : "Remove"}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant={
                                        data[currentSong].selected
                                            ? "contained"
                                            : "outlined"
                                    }
                                    fullWidth
                                    onClick={handleSelect}
                                >
                                    {data[currentSong].selected
                                        ? "Selected"
                                        : "Select"}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color={edited ? "error" : "primary"}
                                    fullWidth
                                    onClick={handleSaveProject}
                                >
                                    Save Project
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleReset}
                                >
                                    Clear
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={onExport}
                                >
                                    Export
                                </Button>
                            </Grid>
                            <Grid item>
                                <MetaDataEditor
                                    song={data[currentSong]}
                                    onSave={handleSaveMeta}
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleCreate}
                                    disabled={!selection}
                                >
                                    Create
                                </Button>
                            </Grid>
                            {/* <Grid item>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleSave}
                                    color="error"
                                    disabled={!edited}
                                >
                                    Save
                                </Button>
                            </Grid> */}
                            <Grid item>
                                <Typography variant="h6" component="span">
                                    {data.reduce(
                                        (acc: number, cur: any) =>
                                            cur.selected ? acc + 1 : acc,
                                        0
                                    )}{" "}
                                    Selected
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            id="outlined-multiline-static"
                            label="Lyrics"
                            multiline
                            rows={15}
                            value={lyrics}
                            onChange={handleLyrisChange}
                            fullWidth
                            inputRef={lyricsRef}
                            onSelect={handleSelectLyrics}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={6}
                        sx={{ height: "calc(100vh - 150px)", overflow: "auto" }}
                        ref={metaphorRef}
                    >
                        <Stack spacing={2}>
                            {metaphors.map((metaphor: any, id: any) => (
                                <Card key={id}>
                                    <CardHeader
                                        action={
                                            <IconButton
                                                aria-label="settings"
                                                onClick={() =>
                                                    handleRemoveMetaphor(id)
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                        // title="Shrimp and Chorizo Paella"
                                        subheader={"Metaphor " + (id + 1)}
                                    />
                                    <CardContent sx={{ pt: 0 }}>
                                        <TextField
                                            id="outlined-multiline-static"
                                            label="Metaphor"
                                            multiline
                                            rows={3}
                                            value={metaphor.metaphor}
                                            onChange={(e) =>
                                                handleMetaphorChange(
                                                    id,
                                                    "metaphor",
                                                    e
                                                )
                                            }
                                            fullWidth
                                            sx={{ mb: 1 }}
                                        />
                                        <TextField
                                            id="outlined-multiline-static"
                                            label="Meaning"
                                            multiline
                                            rows={3}
                                            value={metaphor.meaning}
                                            onChange={(e) =>
                                                handleMetaphorChange(
                                                    id,
                                                    "meaning",
                                                    e
                                                )
                                            }
                                            fullWidth
                                        />
                                    </CardContent>
                                </Card>
                            ))}
                            <Button
                                variant="outlined"
                                onClick={handleAddMetaphor}
                            >
                                Add
                            </Button>
                        </Stack>
                        {/* <TextField
                        id="outlined-multiline-static"
                        label="Metaphor"
                        multiline
                        rows={15}
                        value={metaphor}
                        onChange={handleMetaphorChange}
                        fullWidth
                        inputRef={metaphorRef}
                    /> */}
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}

export default FileViewer
