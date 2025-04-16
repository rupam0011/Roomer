import React from 'react'
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import footerStyle from "@/styles/footer.module.css"

export const Footer = () => {
  return (
    <div className={footerStyle.footer_section}>
      <div className={footerStyle.footer_container}>
      <div className={footerStyle.logo}>
        <p>Roomer</p>
      </div>
      <div className={footerStyle.address}>
        <ul>
          <li>+91 1234-567-890</li>
          <li>info@gmail.com</li>
          <li className={footerStyle.location}>500 Terry Francine Street, 6th Floor, San Francisco, CA 94158</li>
        </ul>

        <hr />
        <div className={footerStyle.icons}>
          <div><FaFacebookF /></div>
          <div><FaInstagram /></div>
          <div><FaXTwitter /></div>
          <div><FaLinkedinIn /></div>
        </div>
      </div>
      <div className={footerStyle.lists}>
        <ul>
          <li>Privacy Policy</li>
          <li>Accessibility</li>
          <li>Statement</li>
          <li>Terms & Conditions</li>
          <li>Refund Policy</li>
        </ul>
      </div>
      <div className={footerStyle.connect}>
        <p>Stay Connected with Us</p>
        <form>
          <label htmlFor="email">Your Email *</label>
          <input type="email" id="email" required />
          <div>
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">I agree to the terms & conditions</label>
          </div>
          <button type="submit">Subscribe</button>
        </form>
      </div>
      </div>
      <div className={footerStyle.copyright}>
        <p>© 2025 by Roomer. Powered and secured by Rupam </p>
      </div>
    </div>
  )
}
