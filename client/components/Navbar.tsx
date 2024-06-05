import Link from "next/link";

const Navbar = () => {
  const links = [
    { href: "/", label: "Home" },
    { href: "/sign-in", label: "Sign In" },
    { href: "/sign-up", label: "Sign Up" },
    { href: "/upload", label:" Upload"},
  ];

  return (
    <nav className="absolute top-0 left-0 w-full">
      <div className="container mx-auto flex justify-center">
        <ul className="items-center flex flex-row justify-around p-4 text-lg font-bold text-white w-1/3">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
