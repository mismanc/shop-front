import React, {useEffect, useRef, useState} from "react";
import {
    AppBar, Box, Button, Checkbox,
    Container,
    CssBaseline,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Toolbar,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";

export function ProductsPage() {
    const [products, setProducts] = useState([]);
    const dataFetched = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (dataFetched.current) return;
        dataFetched.current = true;
        fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/products`)
            .then(response => response.json())
            .then(json => setProducts(json))
            .catch(error => console.error(error));
    }, []);

    const handleClick = (e, id) => {
        const p = products.find(p => p.id === id);
        p.selected = !p.selected;
    };

    const handleBuy = () => {
        const selectedProducts = products.filter(p => p.selected);
        navigate('/checkout', { state: { selectedProducts } });
    };

    return (
        <React.Fragment>
            <CssBaseline/>
            <AppBar
                position="absolute"
                color="default"
                elevation={0}
                sx={{
                    position: 'relative',
                    borderBottom: (t) => `1px solid ${t.palette.divider}`,
                }}
            >
                <Toolbar>
                    <Typography variant="h6" color="inherit" noWrap>
                        Products Page
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container component="main" maxWidth="md" sx={{mb: 4}}>
                <Paper elevation={2} sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="center">Brand Name</TableCell>
                                <TableCell align="right">Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((row) => (
                                <TableRow
                                    onClick={(event) => handleClick(event, row.id)}
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={row.selected}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="center">{row.brandName}</TableCell>
                                    <TableCell align="right">{row.price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button role={undefined} variant="contained" sx={{mt: 3, ml: 1}} onClick={handleBuy}>Buy</Button>
                    </Box>
                </Paper>
            </Container>
        </React.Fragment>
    )
}
