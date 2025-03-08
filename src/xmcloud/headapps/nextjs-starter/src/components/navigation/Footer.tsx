import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import styles from './footer.module.scss';

export default function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles['footer']}>
      <div className={styles['footer__container']}>
        <div className={styles['footer__grid']}>
          <div className={styles['footer__section']}>
            <Link href="/" className={styles['footer__logo_link']}>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/xmboys-I9Z2WL6vvb6Eir7aq8KRZJG7lpLijW.webp"
                alt="XM BOYS Logo"
                width={80}
                height={80}
                className={styles['footer__logo_image']}
              />
              <span className={styles['footer__logo_text']}>XM BOYS</span>
            </Link>
            <p className={styles['footer__description']}>
              Delivering innovative digital solutions and exceptional experiences for our clients.
            </p>
          </div>

          <div className={styles['footer__section']}>
            <h3 className={styles['footer__heading']}>Contact Us</h3>
            <div className={styles['footer__contact_list']}>
              <div className={styles['footer__contact_item']}>
                <Mail size={18} className={styles['footer__icon']} />
                <span>info@xmboys.com</span>
              </div>
              <div className={styles['footer__contact_item']}>
                <Phone size={18} className={styles['footer__icon']} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className={styles['footer__contact_item']}>
                <MapPin size={18} className={styles['footer__icon']} />
                <span>123 Tech Street, Digital City</span>
              </div>
            </div>
          </div>

          <div className={styles['footer__section']}>
            <h3 className={styles['footer__heading']}>Connect With Us</h3>
            <div className={styles['footer__social_list']}>
              <Link href="#" className={styles['footer__social_link']}>
                <Facebook size={24} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className={styles['footer__social_link']}>
                <Twitter size={24} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className={styles['footer__social_link']}>
                <Instagram size={24} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className={styles['footer__social_link']}>
                <Youtube size={24} />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
        </div>

        <div className={styles['footer__divider']}></div>

        <div className={styles['footer__copyright']}>
          <p>© {currentYear} XM BOYS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
