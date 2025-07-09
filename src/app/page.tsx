"use client";

import { useTenant } from "@/context/TenantContext";
import Link from "next/link";
import { Calendar, Search, Users } from "lucide-react"; // İkonlar için

export default function Home() {
  const { tenantId, tenantSlug, loading } = useTenant();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading tenant info...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 lg:px-8 text-center">
      {/* Hero Section */}
      <section className="hero-section mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          {tenantSlug ? (
            <>
              Welcome to <span className="text-primary">{tenantSlug}</span>!
            </>
          ) : (
            <>
              Find Your Perfect Barber,{" "}
              <span className="text-primary">Effortlessly</span>.
            </>
          )}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          {tenantSlug
            ? `You are currently viewing the page for ${tenantSlug}. Book an appointment or explore their services.`
            : `BerberBul is your ultimate platform to discover and book appointments with top barbers near you. Simple, fast, and reliable.`}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {tenantSlug ? (
            <Link
              href={`/barber/${tenantId}`}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-2xl shadow-soft transition duration-300"
            >
              View Barber Profile
            </Link>
          ) : (
            <Link
              href="/search"
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-2xl shadow-soft transition duration-300"
            >
              Find Your Barber
            </Link>
          )}
          <Link
            href="/signup"
            className="bg-secondary hover:bg-secondary-dark text-gray-800 font-bold py-3 px-8 rounded-2xl shadow-soft transition duration-300"
          >
            Join as a Customer
          </Link>
        </div>
      </section>

      {/* How it works */}
      {!tenantSlug && (
        <section className="how-it-works-section container my-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 rounded-2xl shadow-soft bg-card">
              <Search size={48} className="text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                1. Discover Barbers
              </h3>
              <p className="text-gray-600 text-center">
                Browse through a curated list of barbers in your area.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-2xl shadow-soft bg-card">
              <Calendar size={48} className="text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">2. Book with Ease</h3>
              <p className="text-gray-600 text-center">
                Select your preferred service, date, and time in seconds.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-2xl shadow-soft bg-card">
              <Users size={48} className="text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">3. Enjoy Your Cut</h3>
              <p className="text-gray-600 text-center">
                Get ready for a fresh look and a great experience.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials (Placeholder) */}
      {!tenantSlug && (
        <section className="testimonials-section container my-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl shadow-soft bg-card">
              <p className="text-gray-700 italic mb-4">
                BerberBul made booking so easy! Found my new favorite barber in
                minutes.
              </p>
              <p className="font-semibold text-gray-800">- Jane Doe</p>
            </div>
            <div className="p-6 rounded-2xl shadow-soft bg-card">
              <p className="text-gray-700 italic mb-4">
                A fantastic platform for barbers to manage their appointments.
                Highly recommend!
              </p>
              <p className="font-semibold text-gray-800">
                - John Smith, Barber
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section (Barber Signup) */}
      {!tenantSlug && (
        <section className="cta-barber-section container my-16 p-12 bg-primary rounded-2xl shadow-soft text-white">
          <h2 className="text-4xl font-bold mb-6">Are You a Barber?</h2>
          <p className="text-xl mb-8">
            Join BerberBul and grow your business with our easy-to-use booking
            system.
          </p>
          <Link
            href="/barber-signup"
            className="bg-white hover:bg-gray-100 text-primary font-bold py-3 px-8 rounded-2xl shadow-soft transition duration-300"
          >
            Sign Up as a Barber
          </Link>
        </section>
      )}

      {/* Footer */}
      <footer className="w-full py-8 border-t border-gray-200 mt-16">
        <div className="container flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} BerberBul. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact Us
            </Link>
            {/* Language switcher placeholder */}
            {/* <select className="bg-transparent border-none text-gray-600">
              <option>English</option>
              <option>Türkçe</option>
            </select> */}
          </div>
        </div>
      </footer>
    </div>
  );
}
