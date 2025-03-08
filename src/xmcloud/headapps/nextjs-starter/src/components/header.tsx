import Image from 'next/image';
import Link from 'next/link';
import { Github } from 'lucide-react';
import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles['header']}>
      {/* Decorative elements that match the logo's geometric style */}
      <div className={styles['header__decorative_elements']}>
        <div
          className={`${styles['header__decorative_circle']} ${styles['header__decorative-circle--1']} ${styles['header__decorative-circle--blue']}`}
        ></div>
        <div
          className={`${styles['header__decorative_circle']} ${styles['header__decorative-circle--2']} ${styles['header__decorative-circle--yellow']}`}
        ></div>
        <div
          className={`${styles['header__decorative_circle']} ${styles['header__decorative-circle--3']} ${styles['header__decorative-circle--blue']}`}
        ></div>
        <div
          className={`${styles['header__decorative_circle']} ${styles['header__decorative-circle--4']} ${styles['header__decorative-circle--yellow']}`}
        ></div>
      </div>

      {/* Subtle gradient overlay */}
      <div className={styles['header__gradient_overlay']}></div>

      <div className={styles['header__container']}>
        <div className={styles['header__content']}>
          {/* Logo with enhanced presentation */}
          <Link href="/" className={styles['header__logo_link']}>
            <div className={styles['header__logo_wrapper']}>
              <div className={styles['header__logo_glow']}></div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/xmboys-I9Z2WL6vvb6Eir7aq8KRZJG7lpLijW.webp"
                alt="XM BOYS Logo"
                width={60}
                height={60}
                className={styles['header__logo_image']}
              />
            </div>
            <div className={styles['header__logo_content']}>
              <span className={styles['header__logo_title']}>XM BOYS</span>
              <span className={styles['header__logo_subtitle']}>Digital Innovation</span>
            </div>
          </Link>

          {/* GitHub Projects Button */}
          <a
            href="https://github.com/xmboys"
            target="_blank"
            rel="noopener noreferrer"
            className={styles['header__github_link']}
          >
            <Github size={18} className={styles['header__github_icon']} />
            <span className={styles['header__github_text']}>Visit Our Projects</span>
          </a>
        </div>
      </div>

      {/* Subtle bottom border with gradient */}
      <div className={styles['header__bottom_border']}></div>
    </header>
  );
}
