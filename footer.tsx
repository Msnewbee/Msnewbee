
import Link from 'next/link';
import { FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer>
      <div className="footer-links">
        <Link href="/privacy-policy">Kebijakan Privasi</Link>
        <Link href="/terms-and-conditions">Syarat dan Ketentuan</Link>
        <Link href="/content-policy">Kebijakan Penggunaan Konten</Link>
      </div>

      <div className="social-media-links">
        <a href="https://www.instagram.com/username" target="_blank" rel="noopener noreferrer">
          <FaInstagram size={30} />
        </a>
        <a href="https://twitter.com/username" target="_blank" rel="noopener noreferrer">
          <FaTwitter size={30} />
        </a>
      </div>

      <p>© 2025 Ms_bee01. Semua Hak Dilindungi.</p>
    </footer>
  );
};

export default Footer;
    