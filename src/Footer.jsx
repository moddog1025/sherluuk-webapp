import React from "react";
import "./Footer.css";
export default function Footer({ signature }) {
  return <footer className="footer">Hash: {signature}</footer>;
}
