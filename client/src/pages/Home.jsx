import React from 'react'
import Navbar from '../components/layout/Navbar'
import HeroSection from '../components/landing/HeroSection'
import About from '../components/landing/About'
import HowItWorks from '../components/landing/HowItWorks'
import Features from '../components/landing/Features'
import Footer from '../components/layout/Footer'

const Home = () => {
  return (
    <>
    <Navbar/>
    <HeroSection/>
    <About/>
    <HowItWorks/>
    <Features/>
    <Footer/>
    </>
  )
}

export default Home