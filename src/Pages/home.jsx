import React, { lazy, Suspense } from 'react';
import Loader from '../Component/Loader/loader'
// Lazy load components
const Header = lazy(() => import('../Component/Home/header'));
const Section2 = lazy(() => import('../Component/Home/section2.'));
const AboutUs = lazy(() => import('../Component/Home/aboutus'));
const Footer = lazy(() => import('../Component/Home/footer'));
const BlogComponent = lazy(() => import('../Component/Home/blogcomponent'));
const Section = lazy(() => import('../Component/Home/Section'));
const Section1 = lazy(() => import('../Component/Home/section1'));
const OurTeam1 = lazy(() => import('../Component/Home/OurTeam1'));
const OurTeam = lazy(() => import('../Component/Home/OurTeam'));
const TeamMembers = lazy(() => import('../Component/Home/teammember'));
const Section4 = lazy(() => import('../Component/Home/section4'));


const Home = () => {
  return (
    <Suspense fallback={<Loader/>}>
      <Section />
      <Section1 />
      <Section2 />
      <AboutUs />
      <OurTeam1 />
      <OurTeam />
      <BlogComponent />
    </Suspense>
  );
};

export default Home;
