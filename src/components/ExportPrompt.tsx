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

const Transition = forwardRef(function Transition(props, ref) {
    // @ts-ignore: Unreachable code error
    return <Slide direction="up" ref={ref} {...props} />
})

export default function ExportPrompt({ open, handleClose, onExport }: any) {
    const [setting, setSetting] = useState({ removed: true, selected: false })

    const handleChange = (event: any) => {
        const setting_ = { ...setting }
        // @ts-ignore: Unreachable code error
        setting_[event.target.name] = event.target.checked
        setSetting(setting_)
    }

    const handleExportClick = (type: string) => {
        onExport({ ...setting, type })
        handleClose()
    }

    return (
        <div>
            <Dialog
                open={open}
                // @ts-ignore: Unreachable code error
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Export Settings</DialogTitle>
                <DialogContent>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="removed"
                                    checked={setting.removed}
                                    onChange={handleChange}
                                />
                            }
                            label="Ignore Removed"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="selected"
                                    checked={setting.selected}
                                    onChange={handleChange}
                                />
                            }
                            label="Only Selected"
                        />
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => handleExportClick("json")}>
                        JSON
                    </Button>
                    <Button onClick={() => handleExportClick("xlxs")}>
                        XLXS
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
