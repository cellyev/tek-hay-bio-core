/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import configPromise from "@payload-config";
import "@payloadcms/next/css";
import { RootLayout, handleServerFunctions } from "@payloadcms/next/layouts";
import React from "react";
import { importMap } from "./admin-payload/importMap";

const serverFunction = async function (args: any) {
  'use server'
  return handleServerFunctions({ ...args, config: configPromise })
}

type Args = {
  children: React.ReactNode;
};

const Layout = ({ children }: Args) => (
  <RootLayout
    config={configPromise}
    importMap={importMap}
    serverFunction={serverFunction as any}
  >
    {children}
  </RootLayout>
);

export default Layout;
