import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "700"] });

export default function FontTest() {
  return (
    <div className={montserrat.className} style={{ fontSize: 32, margin: 40 }}>
      This text should be in Montserrat (Next.js font optimization test)
    </div>
  );
} 