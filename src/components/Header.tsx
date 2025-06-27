'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { THEME, useTheme } from '@/lib/useLocalStorageValue';

const navLinks = [
  { href: '/rest', label: 'REST' },
  { href: 'webhook', label: 'Webhook' },
  { href: '/settings', label: 'Settings' },
];

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const darkMode = theme === THEME.DARK;

  const toggleTheme = () => {
    setTheme(theme === THEME.DARK ? THEME.LIGHT : THEME.DARK);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="min-w-full flex items-center justify-between px-4 max-[610px]:px-2 max-[305px]:pr-0 py-3">
        {/* Heading on the left */}
        <div className="flex-1 flex items-center justify-start">
          <Link href="/" className="text-2xl max-[610px]:text-xl font-semibold hover:opacity-90 transition-opacity">
            AI Agent
          </Link>
        </div>
        {/* Nav and theme on the right */}
        <div className='flex flex-row'>
          {/* Desktop nav */}
          <div className="flex items-center gap-4 max-[610px]:gap-1 max-[460px]:hidden">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-3 py-1 rounded-md text-sm max-[450px]:text-xs font-medium transition-colors
                    ${isActive
                      ? 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  {label}
                </Link>
              );
            })}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mounted ? darkMode ? <Sun size={18} /> : <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
          {/* Mobile menu button */}
          <div className='flex flex-row gap-1'>
            <button
              className="max-[460px]:flex hidden items-center justify-center p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Open Menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-full min-[460px]:hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mounted ? darkMode ? <Sun size={18} /> : <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
          {/* GitHub logo button */}
          <a
            href="https://github.com/mahmadabid/ai-agent-playground"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center"
            style={{ lineHeight: 0 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 dark:text-gray-200">
              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.594 1.028 2.687 0 3.847-2.337 4.695-4.566 4.944.36.31.68.921.68 1.857 0 1.34-.012 2.422-.012 2.753 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2Z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 max-[460px]:block hidden" onClick={() => setMenuOpen(false)} />
      )}
      <nav
        className={`fixed top-0 right-0 z-50 h-full w-4/5 max-w-xs bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-200 ease-in-out max-[460px]:block hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ minWidth: 220 }}
        aria-label="Mobile menu"
      >
        <div className="flex flex-col h-full p-6 gap-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl font-semibold">Menu</span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close Menu"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X size={22} />
            </button>
          </div>
          <hr className="my-2 border-gray-200 dark:border-gray-700" />
          <div className="flex flex-col gap-2">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive ? 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
