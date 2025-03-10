import { Suspense } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";

import Footer from "@/layouts/footer/Footer";
import Header from "@/layouts/header/Header";

import PageLoadingFallback from "@/containers/page-loading-fallback/PageLoadingFallback";

import AppBox from "@/components/app-box/AppBox";

import { ConfirmProvider } from "@/context/confirm/ConfirmContext";
import { DrawerProvider } from "@/context/drawer/DrawerContext";
import { ModalProvider } from "@/context/modal/ModalContext";

import "@/layouts/root-layout/RootLayout.scss";

const RootLayout = () => {
  return (
    <ConfirmProvider>
      <ModalProvider>
        <DrawerProvider>
          <AppBox className="root-layout">
            <ScrollRestoration />
            <Header />
            <AppBox className="root-layout__content">
              <Suspense fallback={<PageLoadingFallback />}>
                <Outlet />
              </Suspense>
            </AppBox>
            <Footer />
          </AppBox>
        </DrawerProvider>
      </ModalProvider>
    </ConfirmProvider>
  );
};

export default RootLayout;
