import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"

export default function Footer() {
    return (
        <Paper sx={{ bottom: 0 }} component="footer" square variant="outlined">
            <Container maxWidth="lg">
                <Box
                    sx={{
                        flexGrow: 1,
                        justifyContent: "center",
                        display: "flex",
                        my: 1,
                    }}
                >
                    <a>Codio</a>
                </Box>

                <Box
                    sx={{
                        flexGrow: 1,
                        justifyContent: "center",
                        display: "flex",
                        mb: 2,
                    }}
                >
                    <Typography variant="caption">
                        Copyright ©2022. [] Limited
                    </Typography>
                </Box>
            </Container>
        </Paper>
    )
}
