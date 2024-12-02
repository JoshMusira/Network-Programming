import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Home from "../pages/Home";
import Conversation from "../pages/Conversation";
import LandingPageLayout from "../layouts/LandingPageLayout";
import CombinedConversationPage from "../pages/CombinedConversationPage";
import NewsSourcesPage from "../pages/NewsSourcesPage";
import ImageDisplay from "../components/ImageDisplay";
import Youtube from "../pages/Youtube";
import YoutubeUpload from "../pages/YoutubeUpload";
// import uploadedAudioPage from "../pages/uploadedAudioPage";
import TranscribeAudioPage from "../pages/TranscribeAudioPage";
import AudioPage from "../pages/AudioPage";
import AnalysisComponent from "../components/AnalysisComponent";
import DatabaseSelector from "../components/DatabaseSelector";
import Signup from "../pages/Signup";
import OTPInput from "../pages/OTPInput";
import Reset from "../pages/Reset";
import ForgotPassword from "../pages/ForgotPassword";
import Login from "../pages/Login";

export const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route >
            <Route path="/" element={<LandingPageLayout />}>
                <Route index element={<Home />} />
                <Route path='conversation' element={<Conversation />} />
                <Route path='combined-conversation' element={<CombinedConversationPage />} />
                <Route path='Sources' element={<NewsSourcesPage />} />
                <Route path='visuals' element={<AnalysisComponent />} />
                <Route path='youtube-link' element={<Youtube />} />
                <Route path='youtube' element={<YoutubeUpload />} />
                <Route path='local-file-upload' element={<TranscribeAudioPage />} />
                <Route path='uploaded-audio' element={<AudioPage />} />
                <Route path='combined-data-promt' element={<DatabaseSelector />} />
            </Route>
            <Route path="/auth">
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="forgotPassword" element={<ForgotPassword />} />
                <Route path="OTPInput" element={<OTPInput />} />
                <Route path="reset" element={<Reset />} /> 
            </Route>

        </Route >
    )
)