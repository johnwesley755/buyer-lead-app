import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  // Check if user is logged in
  const user = await getSession();
  
  // If logged in, redirect to dashboard page
  if (user) {
    redirect('/dashboard');
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Simple header for landing page */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl">Buyer Lead App</span>
            </div>
            <div>
              <Button asChild variant="outline" size="sm">
                <Link href="/auth/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          <span className="block">Buyer Lead Intake</span>
          <span className="block text-blue-600 mt-2">Simplified Management</span>
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-lg text-gray-500">
          Streamline your buyer lead management process with our intuitive platform. 
          Track, organize, and convert leads efficiently.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="px-8 py-6 text-lg">
            <Link href="/auth/login">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
      
      {/* Features section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Key Features</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
              Everything you need to manage your buyer leads effectively.
            </p>
          </div>
          
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Lead Tracking</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Track all your buyer leads in one place with detailed information.
                </p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">CSV Import/Export</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Easily import and export your buyer data with CSV functionality.
                </p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Status Management</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Track buyer status from new to closed with customizable workflows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Buyer Lead Intake App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
