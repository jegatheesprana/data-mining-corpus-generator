import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container'

const FileViewer = ({data, setData, onExport, handleSaveLocal, handleReset}: any) => {
    const [currentSong, setCurrentSong] = useState(0)
    const [lyrics, setLyrics] = useState("")
    const [metaphor, setMetaphor] = useState("")
    const [edited, setEdited] = useState(false)

    const handleSongChange = (newSong: any) => {
        if (0<=newSong && newSong<data.length) {
            setCurrentSong(newSong)
        }
    }

    const handleLyrisChange = (e: any) => {
        setLyrics(e.target.value)
        setEdited(true)
    }
    
    const handleMetaphorChange = (e: any) => {
        setMetaphor(e.target.value)
        setEdited(true)
    }

    const handleSave = () => {
        const newData = [...data]
        const changedSong = {...data[currentSong]}
        changedSong.lyrics = lyrics
        changedSong.metaphor = metaphor
        newData[currentSong] = changedSong
        setData(newData)
        setEdited(false)
    }

    const handleRemove = () => {
        setData((data: any)=> {
            const newData = [...data]
            newData[currentSong] = {...newData[currentSong], removed: !newData[currentSong].removed}
            return newData
        })
    }

    useEffect(()=>{
        setLyrics(data[currentSong].lyrics||"")
        setMetaphor(data[currentSong].metaphor||"")
        setEdited(false)
    }, [currentSong])

    return (
        <Container sx={{minHeight: '100vh'}}>
        <Box sx={{ flexGrow: 1, mt: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={1}>
                    <Button variant="contained" fullWidth onClick={()=> handleSongChange(currentSong - 1)} disabled={currentSong===0}>Previous</Button>
                </Grid>
                <Grid item xs={5}>
                    {(currentSong+1) + ". " + data[currentSong].song_name}
                </Grid>
                <Grid item xs={5}>
                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Song"
                        value={currentSong}
                        onChange={e=>handleSongChange(e.target.value)}
                        fullWidth
                        variant="standard"
                        >
                        {data.map((row: any, id: any) => (
                            <MenuItem key={id} value={id}>
                            {row.song_name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={1}>
                    <Button variant="contained" fullWidth onClick={()=> handleSongChange(currentSong + 1)} disabled={currentSong===data.length-1}>Next</Button>
                </Grid>

                <Grid item xs={12}>
            
            <Grid container spacing={2}>
                <Grid item >
                    <Button variant={data[currentSong].removed?"contained": "outlined"} fullWidth onClick={handleRemove}>{data[currentSong].removed?"Removed": "Remove"}</Button>
                </Grid>
                <Grid item >
                    <Button variant="contained" fullWidth onClick={handleSaveLocal} >Save Project</Button>
                </Grid>
                <Grid item >
                    <Button variant="contained" fullWidth onClick={handleReset} >Reset</Button>
                </Grid>
                <Grid item >
                    <Button variant="contained" fullWidth onClick={onExport} >Export</Button>
                </Grid>
                <Grid item >
                    <Button variant="contained" fullWidth onClick={handleSave} color="error" disabled={!edited}>Save</Button>
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
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="outlined-multiline-static"
                        label="Metaphor"
                        multiline
                        rows={15}
                        value={metaphor}
                        onChange={handleMetaphorChange}
                        fullWidth
                    />
                </Grid>
            </Grid>
        </Box>
        </Container>
    );
}
 
export default FileViewer;