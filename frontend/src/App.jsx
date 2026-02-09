import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";

// Pages
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import ProjectDetails from "./pages/ProjectDetails";
import TaskDetails from "./pages/TaskDetails";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import LandingPage from "./pages/LandingPage"; 

const App = () => {
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <Routes>
                {/* 1. Root Path Logic: Agar login hai toh Dashboard, nahi toh Landing Page */}
                <Route 
                    path="/" 
                    element={
                        <>
                            <SignedIn>
                                <Navigate to="/dashboard" replace />
                            </SignedIn>
                            <SignedOut>
                                <LandingPage />
                            </SignedOut>
                        </>
                    } 
                />

                {/* 2. Public Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* 3. Protected Dashboard Routes */}
                <Route
                    path="/*"
                    element={
                        <>
                            <SignedIn>
                                <Routes>
                                    <Route element={<Layout />}>
                                        <Route path="dashboard" element={<Dashboard />} />
                                        <Route path="team" element={<Team />} />
                                        <Route path="projects" element={<Projects />} />
                                        <Route path="projectsDetail" element={<ProjectDetails />} />
                                        <Route path="taskDetails" element={<TaskDetails />} />
                                        {/* Fallback inside dashboard */}
                                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                                    </Route>
                                </Routes>
                            </SignedIn>

                            <SignedOut>
                                {/* Agar user logged out hai aur random dashboard link par hai */}
                                <Navigate to="/login" replace />
                            </SignedOut>
                        </>
                    }
                />
            </Routes>
        </>
    );
};

export default App;
