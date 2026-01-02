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
import RoadmapBuilder from './components/mentor/RoadmapBuilder';
import RoadmapsPage from './pages/RoadmapsPage';
import RoadmapDetail from './pages/RoadmapDetail';
import NotificationsPage from './pages/NotificationsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';


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
import MentorsPage from './pages/MentorPage';
import CommunityPage from './pages/CommunityPage';
import ErrorPage from './pages/ErrorPage';


const App = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
      errorElement: <ErrorPage />
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
      errorElement: <ErrorPage />
    },
    {
      path: '/mentors',
      element: <MentorsPage />,
      errorElement: <ErrorPage />
    },
    {
      path: '/community',
      element: <CommunityPage />,
      errorElement: <ErrorPage />
    },
    {
      path: '/mentor',
      element: (
        <ProtectedRoute allowedRoles={['mentor']}>
          <MentorLayout />
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Overview /> },
        { path: 'overview', element: <Overview /> },
        { path: 'sessions', element: <Sessions /> },
        { path: 'request', element: <Request /> },
        { path: 'messages', element: <Messages /> },
        { path: 'profile', element: <Profile /> },
        { path: 'settings', element: <Settings /> },
        { path: 'roadmaps', element: <RoadmapsPage /> },
        { path: 'roadmaps/create', element: <RoadmapBuilder /> },
        { path: 'roadmaps/:id', element: <RoadmapDetail /> },
        { path: 'notifications', element: <NotificationsPage /> },
      ],
    },
    {
      path: '/mentee',
      element: (
        <ProtectedRoute allowedRoles={['mentee']}>
          <MenteeLayout />
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <MenteeOverview /> },
        { path: 'overview', element: <MenteeOverview /> },
        { path: 'schedule', element: <MenteeSchedule /> },
        { path: 'mentors', element: <Mentors /> }, // Updated to Mentors component
        { path: 'messages', element: <MenteeMessage /> },
        { path: 'profile', element: <MenteeProfile /> },
        { path: 'settings', element: <MenteeSettings /> },
        { path: 'roadmaps', element: <RoadmapsPage /> },
        { path: 'roadmaps/:id', element: <RoadmapDetail /> },
        { path: 'notifications', element: <NotificationsPage /> },
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