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
import Menu from "@mui/material/Menu"

import DeleteIcon from "@mui/icons-material/Delete"
import SearchIcon from "@mui/icons-material/Search"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"

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
    const [metaphors, setMetaphors] = useState([
        { metaphor: "", source: "", target: "", interpretation: "" },
    ])
    const [edited, setEdited] = useState(false)
    const [selection, setSelection] = useState("")
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [anchorEl, setAnchorEl] = useState(null)

    const lyricsRef = useRef<HTMLTextAreaElement>(null)
    const metaphorRef = useRef<HTMLDivElement>(null)

    const openAction = Boolean(anchorEl)

    const handleActionClick = (event: any) => {
        setAnchorEl(event.currentTarget)
    }
    const handleActionClose = () => {
        setAnchorEl(null)
    }

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
            changedSong[`metaphor_${i}_source`] = meta?.source || ""
            changedSong[`metaphor_${i}_target`] = meta?.target || ""
            changedSong[`metaphor_${i}_interpretation`] =
                meta?.interpretation || ""
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
        setEdited(true)
    }

    const handleAddMetaphor = () => {
        if (metaphors.length < 5) {
            setMetaphors((metaphors) => [
                ...metaphors,
                { metaphor: "", source: "", target: "", interpretation: "" },
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
                newMeta.push({
                    metaphor: "",
                    target: "",
                    source: "",
                    interpretation: "",
                })
            }
            return newMeta
        })
    }

    const handleFind = (id: number) => {
        let start = lyrics.indexOf(metaphors[id].metaphor)
        if (start === -1) {
            let start_ = lyrics
                .replace(/\s\s+/g, " ")
                .indexOf(metaphors[id].metaphor)
            const selection = lyrics.substring(start_, lyrics.length)
            const start_2 = selection
                .replace(/\s\s+/g, " ")
                .indexOf(metaphors[id].metaphor)
            start = start_ + start_2
        }
        const end = start + metaphors[id].metaphor.length

        if (start > 0 && lyricsRef.current) {
            lyricsRef.current.focus()
            lyricsRef.current.value = lyrics.substring(0, end)
            lyricsRef.current.scrollTop = 0
            lyricsRef.current.scrollTop = lyricsRef.current.scrollHeight
            lyricsRef.current.value = lyrics
            lyricsRef.current.setSelectionRange(start, end)
        } else {
            setMessage("Selection not found")
            setOpen(true)
        }
    }

    const handleSelectLyrics = (e: any) => {
        let textarea = e.target
        let selection = textarea.value.substring(
            textarea.selectionStart,
            textarea.selectionEnd
        )
        // setSelection(selection.replace(/\s\s+/g, " "))
        setSelection(selection.replace(/\s\s+/g, " ").trim())
    }

    const handleCreate = () => {
        if (
            !metaphors[metaphors.length - 1].metaphor &&
            !metaphors[metaphors.length - 1].source
        ) {
            setMetaphors((metaphors) => {
                const newMeta = [...metaphors]
                newMeta[newMeta.length - 1] = {
                    metaphor: selection,
                    source: "",
                    target: "",
                    interpretation: "",
                }
                return newMeta
            })
        } else {
            if (metaphors.length < 5) {
                setMetaphors((metaphors) => {
                    const newMeta = [...metaphors]
                    newMeta[newMeta.length] = {
                        metaphor: selection,
                        source: "",
                        target: "",
                        interpretation: "",
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
                // if (data[currentSong][`metaphor_${i}_meaning`]) {
                //     metaphors.push({
                //         metaphor: data[currentSong][`metaphor_${i}`],
                //         target: data[currentSong][`metaphor_${i}_meaning`],
                //         source: "",
                //         interpretation: "",
                //     })
                // } else {
                metaphors.push({
                    metaphor: data[currentSong][`metaphor_${i}`],
                    target: data[currentSong][`metaphor_${i}_target`] || "",
                    source: data[currentSong][`metaphor_${i}_source`] || "",
                    interpretation:
                        data[currentSong][`metaphor_${i}_interpretation`] || "",
                })
                // }
            }
        }
        if (metaphors.length) {
            setMetaphors(metaphors)
        } else {
            setMetaphors([
                { metaphor: "", target: "", source: "", interpretation: "" },
            ])
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
                    <Grid item xs={6}>
                        <Grid container spacing={2}>
                            <Grid
                                item
                                lg={3}
                                md={4}
                                xs={12}
                                sx={{ display: "flex", alignItems: "center" }}
                            >
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() =>
                                        handleSongChange(currentSong - 1)
                                    }
                                    disabled={currentSong === 0}
                                    startIcon={<ArrowBackIosIcon />}
                                >
                                    Previous
                                </Button>
                            </Grid>
                            <Grid
                                item
                                lg={9}
                                md={8}
                                xs={12}
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
                                                        data[currentSong][
                                                            column.field
                                                        ]
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
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container spacing={2} flexDirection="row-reverse">
                            <Grid
                                item
                                lg={3}
                                md={4}
                                xs={12}
                                sx={{ display: "flex", alignItems: "center" }}
                            >
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() =>
                                        handleSongChange(currentSong + 1)
                                    }
                                    disabled={currentSong === data.length - 1}
                                    endIcon={<ArrowForwardIosIcon />}
                                >
                                    Next
                                </Button>
                            </Grid>
                            <Grid
                                item
                                lg={9}
                                md={8}
                                xs={12}
                                sx={{ display: "flex", alignItems: "center" }}
                            >
                                <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="Song"
                                    value={currentSong}
                                    onChange={(e) =>
                                        handleSongChange(e.target.value)
                                    }
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
                        </Grid>
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
                            <Grid
                                item
                                sx={{
                                    display: {
                                        lg: "block",
                                        sm: "none",
                                        xs: "none",
                                    },
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color={edited ? "error" : "primary"}
                                    fullWidth
                                    onClick={handleSaveProject}
                                >
                                    Save Project
                                </Button>
                            </Grid>
                            <Grid
                                item
                                sx={{
                                    display: {
                                        lg: "block",
                                        sm: "none",
                                        xs: "none",
                                    },
                                }}
                            >
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleReset}
                                >
                                    Clear
                                </Button>
                            </Grid>
                            <Grid
                                item
                                sx={{
                                    display: {
                                        lg: "block",
                                        sm: "none",
                                        xs: "none",
                                    },
                                }}
                            >
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={onExport}
                                >
                                    Export
                                </Button>
                            </Grid>

                            <Grid
                                item
                                sx={{ display: { lg: "none", sm: "block" } }}
                            >
                                <Button
                                    id="basic-button"
                                    aria-controls={
                                        openAction ? "basic-menu" : undefined
                                    }
                                    aria-haspopup="true"
                                    aria-expanded={open ? "true" : undefined}
                                    onClick={handleActionClick}
                                    variant="contained"
                                >
                                    Actions
                                </Button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={openAction}
                                    onClose={handleActionClose}
                                    onClick={handleActionClose}
                                    MenuListProps={{
                                        "aria-labelledby": "basic-button",
                                    }}
                                >
                                    <MenuItem onClick={handleSaveProject}>
                                        Save Project
                                    </MenuItem>
                                    <MenuItem onClick={handleReset}>
                                        Clear
                                    </MenuItem>
                                    <MenuItem onClick={onExport}>
                                        Export
                                    </MenuItem>
                                </Menu>
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
                                            <>
                                                <IconButton
                                                    aria-label="settings"
                                                    onClick={() =>
                                                        handleFind(id)
                                                    }
                                                >
                                                    <SearchIcon />
                                                </IconButton>
                                                <IconButton
                                                    aria-label="settings"
                                                    onClick={() =>
                                                        handleRemoveMetaphor(id)
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </>
                                        }
                                        // title="Shrimp and Chorizo Paella"
                                        subheader={"Metaphor " + (id + 1)}
                                    />
                                    <CardContent sx={{ pt: 0 }}>
                                        <TextField
                                            id="outlined-multiline-static"
                                            label="Metaphor"
                                            multiline
                                            rows={2}
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
                                            label="Source"
                                            multiline
                                            rows={1}
                                            value={metaphor.source}
                                            onChange={(e) =>
                                                handleMetaphorChange(
                                                    id,
                                                    "source",
                                                    e
                                                )
                                            }
                                            fullWidth
                                            sx={{ mb: 1 }}
                                        />
                                        <TextField
                                            id="outlined-multiline-static"
                                            label="Target"
                                            multiline
                                            rows={1}
                                            value={metaphor.target}
                                            onChange={(e) =>
                                                handleMetaphorChange(
                                                    id,
                                                    "target",
                                                    e
                                                )
                                            }
                                            fullWidth
                                            sx={{ mb: 1 }}
                                        />
                                        <TextField
                                            id="outlined-multiline-static"
                                            label="Interpretation"
                                            multiline
                                            rows={1}
                                            value={metaphor.interpretation}
                                            onChange={(e) =>
                                                handleMetaphorChange(
                                                    id,
                                                    "interpretation",
                                                    e
                                                )
                                            }
                                            fullWidth
                                            sx={{ mb: 1 }}
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
