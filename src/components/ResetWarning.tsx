import { useState, forwardRef } from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import DialogTitle from "@mui/material/DialogTitle"
import Slide from "@mui/material/Slide"

import WarningAmberIcon from "@mui/icons-material/WarningAmber"

const Transition = forwardRef(function Transition(props, ref) {
    // @ts-ignore: Unreachable code error
    return <Slide direction="up" ref={ref} {...props} />
})

export default function ResetWarning({ open, handleClose, onAccept }: any) {
    const [setting, setSetting] = useState({ removed: true, selected: false })

    const handleChange = (event: any) => {
        const setting_ = { ...setting }
        // @ts-ignore: Unreachable code error
        setting_[event.target.name] = event.target.checked
        setSetting(setting_)
    }

    const handleExportClick = () => {
        onAccept(setting)
        handleClose()
    }

    return (
        <div>
            <Dialog
                open={open}
                fullWidth
                maxWidth="sm"
                // @ts-ignore: Unreachable code error
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    Are you sure you want to clear the project?
                </DialogTitle>
                <DialogContent sx={{ textAlign: "center" }}>
                    <WarningAmberIcon color="error" fontSize="large" />
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button
                        fullWidth
                        onClick={handleExportClick}
                        variant="contained"
                        color="error"
                    >
                        Clear
                    </Button>
                    <Button
                        fullWidth
                        onClick={handleClose}
                        variant="contained"
                        color="success"
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
