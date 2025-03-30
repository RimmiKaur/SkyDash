"use client"
import { Provider } from "react-redux";
import MainLayout from "./components/MainLayout";
import "./globals.css";
import { store } from "./store/store";



export default function RootLayout({ children }) {
  // Ensure the store is correctly provided
  return (
    <html lang="en">
      <body>
      <Provider store={store}>

        <MainLayout>{children}</MainLayout>
        </Provider>

      </body>
    </html>
  );
}
