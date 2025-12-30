import React from 'react'
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import MentorLayout from './pages/Dashboard/MentorLayout'
// Mentor Dashboard Pages
import Overview from './pages/Dashboard/Overview';
import Sessions from './pages/Dashboard/Sessions';
import Request from './pages/Dashboard/Request';
import Messages from './pages/Dashboard/Messages';
import Profile from './pages/Dashboard/Profile';
import Settings from './pages/Dashboard/Settings';
// Mentee Dashboard Pages
import MenteeLayout from './pages/Dashboard/MenteeLayout';
import MenteeOverview from './pages/Dashboard/MenteeOverview';
import MenteeSchedule from './pages/Dashboard/MenteeSchedule';
import Mentors from './pages/Dashboard/MentorofMentee'; // Renamed import
import MenteeMessage from './pages/Dashboard/MenteeMessage';
import MenteeProfile from './pages/Dashboard/MenteeProfile';
import MenteeSettings from './pages/Dashboard/MenteeSettings';
import MentorProfileDetail from './pages/MentorProfileDetail'; // New import


const App = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/signup',
      element: <SignUp />
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />
    },
    {
      path: '/reset-password/:token',
      element: <ResetPassword />
    },
    {
      path: '/mentors/:mentorId', // New route for individual mentor profiles
      element: <MentorProfileDetail />,
    },
    {
      path: '/mentor',
      element: <MentorLayout />,
      children: [
        { index: true, element: <Overview /> },
        { path: 'overview', element: <Overview /> },
        { path: 'sessions', element: <Sessions /> },
        { path: 'request', element: <Request /> },
        { path: 'messages', element: <Messages /> },
        { path: 'profile', element: <Profile /> },
        { path: 'settings', element: <Settings /> },
      ],
    },
    {
      path: '/mentee',
      element: <MenteeLayout />,
      children: [
        { index: true, element: <MenteeOverview /> },
        { path: 'overview', element: <MenteeOverview /> },
        { path: 'schedule', element: <MenteeSchedule /> },
        { path: 'mentors', element: <Mentors /> }, // Updated to Mentors component
        { path: 'messages', element: <MenteeMessage /> },
        { path: 'profile', element: <MenteeProfile /> },
        { path: 'settings', element: <MenteeSettings /> },
      ],
    }

  ])
  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App;