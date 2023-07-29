import React, {useCallback, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {
    AppBar, Box, Button,
    Container,
    CssBaseline,
    Grid, InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";

export function CheckoutPage() {
    const location = useLocation();
    const [total, setTotal] = useState(0);
    const [totalKDV, setTotalKDV] = useState(0);
    const [shipment, setShipment] = useState('STANDARD_FREE');

    const calculatePrices = useCallback((ship) => {
        if (location.state.selectedProducts) {
            let totalPrice = 0;
            for (const pro of location.state.selectedProducts) {
                totalPrice += pro.price;
            }
            const kdv = Number(((totalPrice * 18) / 100).toFixed(2));
            totalPrice += kdv;
            if (ship === 'EXPRESS_10_EUR') {
                totalPrice += 10;
            }
            setTotal(totalPrice);
            setTotalKDV(Number(kdv));
        }
    }, [location.state.selectedProducts]);

    useEffect(() => {
        calculatePrices(shipment);
    }, [calculatePrices, shipment]);

    const handleBuyNow = () => {
        fetch('http://localhost:8080/api/v1/orders')
            .then(response => response.json())
            .then(json => console.log(json))
            .catch(error => console.error(error));
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
                        Checkout Page
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container component="main" maxWidth="md" sx={{mb: 4}}>
                <Paper elevation={2} sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="name"
                                name="name"
                                label="Client name"
                                fullWidth
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="lastName"
                                name="lastName"
                                label="Last name"
                                fullWidth
                                autoComplete="family-name"
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="address"
                                name="address"
                                label="Address"
                                fullWidth
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel sm={6} id="shipment-select-label">Shipment Type</InputLabel>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Select
                                sm={6}
                                labelId="shipment-select-label"
                                id="shipment-select"
                                value={shipment}
                                label="Shipment"
                                onChange={(ev) => setShipment(ev.target.value)}
                            >
                                <MenuItem value="EXPRESS_10_EUR">EXPRESS_10_EUR</MenuItem>
                                <MenuItem value="STANDARD_FREE">STANDARD_FREE</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="cardNumber"
                                name="cardNumber"
                                label="Card Number"
                                fullWidth
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                id="expDate"
                                label="Expiry date"
                                fullWidth
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                id="cvv"
                                label="CVV"
                                helperText="Last three digits on signature strip"
                                fullWidth
                                variant="standard"
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{width: 1}} mt={5}>
                        <Box sx={{width: 1}}>
                            <Typography align="right" variant="h6">
                                KDV: {totalKDV}
                            </Typography>
                        </Box>
                        <Box sx={{width: 1}}>
                            <Typography align="right" variant="h5">
                                Total: {total}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button role={undefined} variant="contained" sx={{mt: 3, ml: 1}} onClick={handleBuyNow}>Buy
                            Now</Button>
                    </Box>
                </Paper>
            </Container>
        </React.Fragment>
    )
}
