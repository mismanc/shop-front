import React, {useCallback, useEffect, useRef, useState} from "react";
import {useLocation} from "react-router-dom";
import {
    Alert,
    AppBar, Box, Button,
    Container,
    CssBaseline,
    Grid, InputLabel,
    MenuItem,
    Paper,
    Select, Snackbar,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";

export function CheckoutPage() {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [total, setTotal] = useState(0);
    const [totalKDV, setTotalKDV] = useState(0);
    const [shipment, setShipment] = useState('STANDARD_FREE');
    const textClient = useRef();
    const textAddress = useRef();
    const textCard = useRef();
    const textExpireDate = useRef();
    const textCCV = useRef();

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

    const handleClose = () => {
        setOpen(false);
    };

    const handleBuyNow = () => {
        if (!textClient.current.value || !textAddress.current.value || !textCard.current.value ||
            !textExpireDate.current.value) {
            setErrorMessage('Required Fields Empty!');
            setOpen(true);
            return;
        }
        const data = {
            name: textClient.current.value,
            address: textAddress.current.value,
            shippingOption: shipment !== 'STANDARD_FREE' ? 'EXPRESS' : shipment,
            products: location.state.selectedProducts,
            card: {
                cardNumber: textCard.current.value, ccv: textCCV.current.value,
                expirationDate: textExpireDate.current.value
            }
        };

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        };
        fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/orders`, requestOptions)
            .then(async response => {
                const result = await response.json();
                if (response.status !== 201) {
                    setErrorMessage(result.message);
                } else {
                    setErrorMessage("Successful");
                }
                setOpen(true);
                return result;
            })
            .catch(error => {
                setErrorMessage(error.message);
                setOpen(true);
            });
    };

    return (
        <React.Fragment>
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                    {errorMessage}
                </Alert>
            </Snackbar>
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
            <Container component="main" maxWidth="sm" sx={{mb: 4}}>
                <Paper elevation={2} sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                inputRef={textClient}
                                required
                                id="name"
                                name="name"
                                label="Client name"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                inputRef={textAddress}
                                required
                                id="address"
                                name="address"
                                label="Address"
                                fullWidth
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
                                inputProps={{
                                    maxLength: 16
                                }}
                                defaultValue="5555555555554444"
                                id="cardNumber"
                                name="cardNumber"
                                label="Card Number"
                                inputRef={textCard}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                id="expDate"
                                defaultValue="11/25"
                                inputRef={textExpireDate}
                                label="Expiry date"
                                fullWidth
                                inputProps={{
                                    maxLength: 5
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                inputProps={{
                                    maxLength: 3
                                }}
                                defaultValue="123"
                                id="cvv"
                                label="CVV"
                                inputRef={textCCV}
                                helperText="Last three digits on signature strip"
                                fullWidth
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
