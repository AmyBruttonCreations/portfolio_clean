import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/vector-art", label: "Vector Art" },
  { href: "/cel-animation", label: "Cel Animation" },
  { href: "/illustration-2d", label: "2D Illustration" },
  { href: "/illustration-3d", label: "3D Illustration" },
  { href: "/contact", label: "Contact" },
];

export default function Contact() {
  return (
    <div className="min-h-screen py-24 flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <nav className="w-full flex justify-center gap-4 py-4 bg-white/80 dark:bg-gray-800/80 shadow fixed top-0 left-0 z-10">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="px-4 py-2 rounded hover:bg-purple-100 dark:hover:bg-purple-900 transition font-medium">
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="pt-20 w-full flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8">Contact</h1>
        <p className="mb-6 text-center">[Contact form or email/social links placeholder]</p>
        <a href="mailto:your@email.com" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Email Me</a>
      </div>
    </div>
  );
} 