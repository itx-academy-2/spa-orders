import { useEffect } from "react";

import PageWrapper from "@/layouts/page-wrapper/PageWrapper";

import BestSellers from "@/containers/best-sellers/BestSellers";
import CallToAction from "@/containers/call-to-action/CallToAction";
import CategorySection from "@/containers/category-section/CategorySection";
import IntroBanner from "@/containers/intro-banner/IntroBanner";
import Subintro from "@/containers/subintro/Subintro";

const HomePage = () => {
  useEffect(() => {
    const url = window.location.href;
    const id = url.split("#")[1];

    const targetEl = document.getElementById(id);

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <>
      <IntroBanner />
      <PageWrapper>
        <Subintro />
        <CallToAction />
        <BestSellers />
        <CategorySection />
      </PageWrapper>
    </>
  );
};

export default HomePage;
