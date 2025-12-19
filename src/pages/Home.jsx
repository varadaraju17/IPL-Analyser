import React from 'react';
import Hero from '../components/home/Hero';
import LogoMarquee from '../components/home/LogoMarquee';
import MarketMovers from '../components/home/MarketMovers';
import Features from '../components/home/Features';

const Home = () => {
    return (
        <div className="home-page">
            <Hero />
            <LogoMarquee />
            <MarketMovers />
            <Features />
        </div>
    );
};

export default Home;
