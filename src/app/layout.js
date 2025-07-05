import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  clashDisplay,
  zodiakVariable,
  zodiakVariableItalic,
  montserratVariable,
} from "./fonts/font";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "../redux/provider";

export const metadata = {
  title: "EZTax India",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${clashDisplay.variable} ${zodiakVariable.variable} ${zodiakVariableItalic.variable} ${montserratVariable.variable}`}
      >
        <ReduxProvider>
            {" "}
            {children}
        </ReduxProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "8px",
              background: "#333",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
