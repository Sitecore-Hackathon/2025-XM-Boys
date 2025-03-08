import Link from 'next/link';
import { Github } from 'lucide-react';
import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles['header']}>
      {/* Decorative elements that match the logo's geometric style */}
      <div className={styles['header__decorative_elements']}>
        <div
          className={`${styles['header__decorative-circle']} ${styles['header__decorative-circle--1']} ${styles['header__decorative-circle--blue']}`}
        ></div>
        <div
          className={`${styles['header__decorative-circle']} ${styles['header__decorative-circle--2']} ${styles['header__decorative-circle--yellow']}`}
        ></div>
        <div
          className={`${styles['header__decorative-circle']} ${styles['header__decorative-circle--3']} ${styles['header__decorative-circle--blue']}`}
        ></div>
        <div
          className={`${styles['header__decorative-circle']} ${styles['header__decorative-circle--4']} ${styles['header__decorative-circle--yellow']}`}
        ></div>
      </div>

      {/* Subtle gradient overlay */}
      <div className={styles['header__gradient-overlay']}></div>

      <div className={styles['header__container']}>
        <div className={styles['header__content']}>
          {/* Logo with enhanced presentation */}
          <Link href="/" className={styles['header__logo-link']}>
            <div className={styles['header__logo-wrapper']}>
              <div className={styles['header__logo-glow']}></div>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/xmboys-I9Z2WL6vvb6Eir7aq8KRZJG7lpLijW.webp"
                alt="XM BOYS Logo"
                width={60}
                height={60}
                className={styles['header__logo-image']}
              />
            </div>
            <div className={styles['header__logo-content']}>
              <span className={styles['header__logo-title']}>XM BOYS</span>
              <span className={styles['header__logo-subtitle']}>
                Delivering innovative digital solutions and exceptional experiences for our clients
              </span>
            </div>
          </Link>

          {/* GitHub Projects Button */}
          <a
            href="https://github.com/Sitecore-Hackathon/2025-XM-Boys"
            target="_blank"
            rel="noopener noreferrer"
            className={styles['header__github-link']}
          >
            <Github size={18} className={styles['header__github-icon']} />
            <span className={styles['header__github-text']}>Visit Our Projects</span>
          </a>
        </div>
      </div>

      {/* Subtle bottom border with gradient */}
      <div className={styles['header__bottom-border']}></div>
    </header>
  );
}
