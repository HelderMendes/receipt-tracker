import PDFDropzone from "@/components/PDFDropzone";
import ReceiptList from "@/components/ReceiptList";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChartBarBig, Search, Shield, Upload } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center flex-col min-h-screen space-y-16 bg-accent/90 dark:bg-accent/70">
      {/* hero */}
      <section className="relative w-full bg-blue-950 text-white flex items-center justify-center py-24">
        <div className="container px-4 md:px-6 mx-auto py-8 space-y-6 text-center">
          <div className="flex flex-col items-center space-y-4 ">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight sm:text-4xl lg:text-6xl mb-6">
                Intelligent Receipt Scanning
              </h1>
              <p className="mx-auto max-w-[700px] text-purple-200 md:text-xl dark:text-gray-400 leading-relaxed">
                Scan, analyze, and organize your receipts effortlessly with our
                AI-powered receipt tracker. Say goodbye to manual entry and
                hello to seamless expense management. Save time and gain
                insights from your spending habits.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/receipts">
                <Button
                  variant="default"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
                >
                  Get Started <ArrowRight className="size-4 ml-2" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  className="bg-transparent border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          {/* PDF dropzone */}
          <div className="mt-12 flex justify-center flex-col items-center gap-8">
            <div className="relative w-full max-w-3xl rounded-lg border-gray-200 text-white overflow-auto  dark:border-gray-800 dark:bg-gray-950">
              <PDFDropzone />
            </div>
            <div className="max-w-full w-full mx-0 md:mx-8">
              <ReceiptList />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center ">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl mb-6  text-purple-600">
                Powerful Features
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg dark:text-gray-400 leading-relaxed">
                Our AI-powered receipt scanner offers a range of features to
                simplify your expense management:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {/* Feature 01 */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center ">
                <div className=" bg-purple-100 dark:bg-purple-900 rounded-full p-3">
                  <Upload className="size-6  text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold my-4">Easy uploads</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Drag and drop your receipts or upload images and PDFs for
                  instant scanning and processing.
                </p>
              </div>
              {/* Feature 02 */}

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center">
                <div className=" bg-purple-100 dark:bg-purple-900 rounded-full p-3">
                  <Search className="size-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold my-4">AI Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Automatically extract and organize your expenses with advanced
                  Optical Character Recognition (OCR) technology.
                </p>
              </div>
              {/* Feature 03 */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center">
                <div className=" bg-purple-100 dark:bg-purple-900 rounded-full p-3">
                  <ChartBarBig className="size-6  text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold my-4">Expense insights</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Generate reports and gain valuable information from your
                  spending patterns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="prices"
        className="relative w-full bg-blue-950 text-white flex items-center justify-center py-24"
      >
        <div className="container px-4 md:px-6 mx-auto py-8 space-y-6 text-center">
          <div className="flex flex-col items-center space-y-4 ">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight sm:text-4xl lg:text-6xl mb-6">
                Simple Pricing
              </h1>
              <p className="mx-auto max-w-[700px] text-purple-200 md:text-xl dark:text-gray-400 leading-relaxed">
                Choose the plan that fits your needs. Start for free, upgrade
                anytime. No hidden fees, cancel anytime.
              </p>
            </div>
          </div>
          <div className="grid grid-col-1 md:grid-cols-3 gap-8 mt-8">
            {/* Free Tier – Free Plan (01) */}
            <div className="flex flex-col p-6 bg-white/5 border border-gray-200 rounded-lg shadow-sm dark:border-purple-400  dark:bg-purple-950 items-center space-y-4 hover:shadow-lg transition-shadow duration-300 hover:border hover:border-purple-600 hover:bg-white hover:text-purple-600">
              <h3 className="text-xl font-semibold mt-4 mb-[2px]">Free Plan</h3>
              <p className="font-mono text-sm mb-3 text-purple-400 uppercase">
                Free tier for all to try!
              </p>
              <p className="text-4xl font-bold mb-4">
                € 0<span className="text-base font-normal">/month</span>
              </p>
              <ul className="text-gray-500 dark:text-gray-400 mb-7 space-y-2 font-medium leading-5 ">
                <li>Up to 10 receipts/month</li>
                <li>Basic AI analysis</li>
                <li>Email support</li>
                <li>7-day history</li>
              </ul>
              <Link href="/manage-plan">
                <Button
                  variant="outline"
                  className="bg-transparent border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
                >
                  Sign up for free
                </Button>
              </Link>
            </div>
            {/* Starter Plan – Plan 02 */}

            <div className="flex flex-col p-6 bg-white/5 border border-gray-200 rounded-lg shadow-sm dark:border-purple-400  dark:bg-purple-950 items-center space-y-4 hover:shadow-lg transition-shadow duration-300 hover:border hover:border-purple-600 hover:bg-white hover:text-purple-600">
              <h3 className="text-xl font-semibold mt-4 mb-[2px]">
                Starter Plan
              </h3>
              <p className="font-mono text-sm mb-3 text-purple-400 uppercase">
                A taste of expensive goodness!
              </p>
              <p className="text-4xl font-bold mb-4">
                € 4.99<span className="text-base font-normal">/month</span>
              </p>
              <ul className="text-gray-500 dark:text-gray-400 mb-7 space-y-2 font-medium leading-5 ">
                <li>Up to 50 scans/month</li>
                <li>Advanced data extraction</li>
                <li>30 days history</li>
                <li>Basic export options</li>
              </ul>
              <Link href="/manage-plan">
                <Button
                  variant="outline"
                  className="bg-transparent border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
                >
                  Choose Plan
                </Button>
              </Link>
            </div>
            {/* Pro Tier – Plan 03 */}
            <div className="relative flex flex-col p-6 bg-white/5 border border-gray-200 rounded-lg shadow-sm dark:border-purple-400  dark:bg-purple-950 items-center space-y-4 hover:shadow-lg transition-shadow duration-300 hover:border hover:border-purple-600 hover:bg-white hover:text-purple-600">
              <div className="absolute -top-6 -right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium rotate-4">
                Popular
              </div>

              <h3 className="text-xl font-semibold mt-4 mb-[2px]">Pro Plan</h3>
              <p className="font-mono text-sm mb-3 text-purple-400 uppercase">
                Pro features for pro user!
              </p>
              <p className="text-4xl font-bold mb-4">
                € 9.99<span className="text-base font-normal">/month</span>
              </p>
              <ul className="text-gray-500 dark:text-gray-400 mb-7 space-y-2 font-medium leading-5 ">
                <li>Up to 300 scans per month</li>
                <li>Premium AI analysis</li>
                <li>Advanced AI data extraction</li>
                <li>AI Summaries</li>
                <li>Unlimited backup recovery</li>
              </ul>
              <Link href={"manage-plan"}>
                <Button
                  variant="default"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Info */}
      <section className="pt-16 ">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center ">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl mb-6  text-purple-600">
                Start scanning today
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg dark:text-gray-400 leading-relaxed">
                Join thousands of users who trust our AI-powered receipt scanner
                to simplify their expense management. Sign up now and experience
                the future of receipt tracking!
              </p>
            </div>
            <div className="space-x-4 mt-4 pb-10">
              <Link href="/receipts">
                <Button
                  variant="default"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
                >
                  Get Started <ArrowRight className="size-4 ml-2" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  className="bg-transparent border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t  border-gray-200 dark:border-gray-800 text-center py-6 mt-0 bg-purple-100">
        <div className="container px-4 md:px-6  mx-auto">
          <div className="flex items-center space-x-1 justify-center">
            <Shield className="size-6 text-purple-600 " />
            <span className="text-xl font-semibold text-purple-600">
              Expensio
            </span>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Receipt Scanner. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
