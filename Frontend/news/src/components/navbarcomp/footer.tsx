import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-black h-full  text-primary-foreground px-4 md:px-6 py-4 flex items-center justify-between z-50">
      <p className="text-sm">&copy; 2024 The Global Buzz. All rights reserved.</p>
      <nav className="flex items-center gap-4">
        <Link href="#" className="text-sm hover:underline" prefetch={false}>
          Privacy Policy
        </Link>
        <Link href="#" className="text-sm hover:underline" prefetch={false}>
          Terms of Service
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;