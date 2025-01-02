
import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import VerificationEmailPage from "./pages/VerificationEmailPage";
import { Toaster } from "./components/ui/toaster";
function App() {

  return (
   <div className="">
    <Routes>
      <Route path="/" element={"Home"} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-email" element={<VerificationEmailPage />} />
    </Routes>
    <Toaster />
   </div>
  )
}

export default App
