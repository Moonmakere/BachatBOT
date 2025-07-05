import React from "react";
import { HeroSection } from "../../components/home/heroSection";
import Steps  from "../../components/home/steps"
import {FeatureSection} from "../../components/home/feature"
import Footer from "../../components/layout/footer"

export default function LandingPage() {
  return (
    <>
      <HeroSection></HeroSection>
      <FeatureSection></FeatureSection>
      <Steps></Steps>
      <Footer></Footer>
    </>
  );
}
