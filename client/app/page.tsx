/**
 * v0 by Vercel.
 * @see https://v0.dev/t/YbXnMxsn3ll
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import LogoIcon from "@/components/LogoIcon";

import { Montserrat } from "next/font/google";
import { Roboto } from 'next/font/google';
import { Poppins } from "next/font/google";
import { Red_Hat_Display } from "next/font/google";
import { Open_Sans } from "next/font/google";


const roboto = Roboto({ weight: '500', style: 'normal', subsets: ['latin'] });
const montserrat = Montserrat({ weight: "600", style: "normal", subsets: ["latin"] });
const poppins = Poppins({ weight: "800", style: "normal", subsets: ["latin"] });
const redHatDisplay = Red_Hat_Display({ weight: '400', style: 'normal', subsets: ['latin'] });
const openSans = Open_Sans({ weight: '400', style: 'normal', subsets: ['latin'] });

export default function Component() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <header className="container mx-auto px-4 py-6 md:px-6 lg:py-8">
        <div className="flex items-center justify-between">
          <Link href="#" className="flex items-center gap-1" prefetch={false}>
            <LogoIcon fill="#000000" width="25px" height="25px" className=""/>
            <span className={`${montserrat.className} text-blue-700 tracking-tighter text-lg font-semibold`}>Syntoma</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              prefetch={false}
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              prefetch={false}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-2 md:px-6 lg:py-16">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Revolutionize Your Medical Imaging
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Our platform allows radiologists and patients to upload X-ray scans and get results instantly. Streamline
              your medical imaging workflow and obtain a second opinion in seconds.
            </p>
            <div className="flex gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                prefetch={false}
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                prefetch={false}
              >
                Learn More
              </Link>
            </div>
          </div>
          <img
            src="/images/hero.png"
            width={600}
            height={400}
            alt="Medical Imaging"
            className="ml-6 rounded-xl object-cover object-center"
          />
        </section>
        
        <section className="bg-muted py-12 md:py-16">
          <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-2 md:px-6 lg:grid-cols-3 lg:gap-12">
            <div className="space-y-2">
              <UploadIcon className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">Upload X-Ray Scans</h3>
              <p className="text-muted-foreground">Easily upload your X-ray scans to our secure platform.</p>
            </div>
            <div className="space-y-2">
              <ScanIcon className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">Instant Analysis</h3>
              <p className="text-muted-foreground">Get instant analysis and results for your X-ray scans.</p>
            </div>
            <div className="space-y-2">
              <CombineIcon className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">Collaborate with Ease</h3>
              <p className="text-muted-foreground">Seamlessly collaborate with radiologists and patients.</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-muted py-6">
        <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
          <p className="text-sm text-muted-foreground">&copy; 2024 Syntoma. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm hover:underline" prefetch={false}>
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm hover:underline" prefetch={false}>
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function CombineIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="8" x="2" y="2" rx="2" />
      <path d="M14 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" />
      <path d="M20 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" />
      <path d="M10 18H5c-1.7 0-3-1.3-3-3v-1" />
      <polyline points="7 21 10 18 7 15" />
      <rect width="8" height="8" x="14" y="14" rx="2" />
    </svg>
  )
}


function CrossIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" />
    </svg>
  )
}


function ScanIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    </svg>
  )
}


function UploadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}