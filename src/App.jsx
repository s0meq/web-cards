import { BrowserRouter, Route, Routes } from "react-router-dom";
import BlackJack from "./components/BlackJack";
import StartMenu from "./components/StartMenu";
import Placeholder from "./components/Placeholder";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartMenu />} />
        <Route path="/blackjack" element={<BlackJack />} />
        <Route path="/poker" element={<Placeholder title="Poker" />} />
        <Route path="/solitaire" element={<Placeholder title="Solitaire" />} />
        <Route path="/war" element={<Placeholder title="War" />} />
        <Route path="*" element={<Placeholder title="Not Found" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
