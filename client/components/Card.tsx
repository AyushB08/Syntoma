/**
 * v0 by Vercel.
 * @see https://v0.dev/t/1HGAPNKiajA
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import Image from "next/image";
export default function Card() {
  return (
    <div className="flex items-center gap-6 p-6 rounded-lg shadow-lg bg-white text-blue-600">
      <div className="flex-shrink-0">
        <Image src="/images/knee-sample.png" alt="X-Ray Image" width={230} height={230} className="rounded-lg" />
      </div>
      <div className="flex-1 space-y-2">
        <div>
          <h3 className="text-xl font-bold">Knee X-Ray Analysis</h3>
         
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDaysIcon className="w-4 h-4" />
          <span>Scanned on July 7, 2024</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <PercentIcon className="w-4 h-4" />
          <span>Confidence: 92%</span>
        </div>
        <p className="text-muted-foreground "><span className=" items-center justify-center text-center font-bold text-2xl text-green-600">Healthy</span></p>
        <p className="w-52">
        Our model did not detect Knee Osteoarthritis.
        It is recommended to visit a doctor for more information.
        </p>

      </div>
    </div>
  )
}

function CalendarDaysIcon(props) {
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
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  )
}


function PercentIcon(props) {
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
      <line x1="19" x2="5" y1="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  )
}