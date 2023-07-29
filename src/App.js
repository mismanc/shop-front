import './App.css';
import {Route, Routes} from "react-router-dom";
import {ProductsPage} from "./components/Products";
import {CheckoutPage} from "./components/Checkout";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<ProductsPage/>}/>
                <Route path="/checkout" element={<CheckoutPage/>}/>
            </Routes>
        </div>
    );
}

export default App;
