import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField';

import columns from '../columns'

const Transition = React.forwardRef(function Transition(props, ref) {
    // @ts-ignore: Unreachable code error
    return <Slide direction="up" ref={ref} {...props} />;
  });

const MetaDataEditor = ({song, onSave}: any) => {
    const [open, setOpen] = React.useState(false);
    const [values, setValues] = React.useState({})

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    onSave(values);
    handleClose()
  }

  const handleChange = (e: any) => {
    console.log()
    setValues((values: any)=> ({...values, [e.target.name]: e.target.value}))
  }

  React.useEffect(()=>{
    setValues(song)
  }, [song])

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen}>
        Edit metadata
      </Button>
      <Dialog
        open={open}
        // @ts-ignore: Unreachable code error
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{song.song_name}</DialogTitle>
        <DialogContent>
            <Box sx={{mt: 2}}>
            <Grid container spacing={2}>
                {columns.filter((col: any)=>col.edit).map((col, id)=>(
                    <Grid key={id} item xs={6}>
                        <TextField
                            required
                            id="outlined-required"
                            label={col.name}
                            name={col.field}
                            fullWidth
                            // @ts-ignore: Unreachable code error
                            value={values[col.field]}
                            onChange={handleChange}
                        />
                    </Grid>
                ))}
            </Grid>
            </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
 
export default MetaDataEditor;