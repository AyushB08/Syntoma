import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 w-full">
      <div className="container mx-auto flex justify-center">
        <ul className="items-center flex flex-row justify-around p-4 text-lg font-bold text-white w-1/3">
          <Link href="/">Home</Link>
          <Link href="/sign-in">Sign In</Link>
          <Link href="/sign-up">Sign Up</Link>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
