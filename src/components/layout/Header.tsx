import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import AuthModal from '../auth/AuthModal';
import UserMenu from '../auth/UserMenu';
import { useAuth } from '../auth/AuthProvider';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header 
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${isScrolled ? 'bg-black/80 backdrop-blur-md py-3' : 'bg-transparent py-5'}
        `}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-white text-xl font-bold font-display">
              Rectif<span className="text-blue-400">AI</span>
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors text-sm">
              How It Works
            </a>
            <a href="#simulator" className="text-gray-300 hover:text-white transition-colors text-sm">
              Try It
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors text-sm">
              Pricing
            </a>
            
            {loading ? (
              <div className="w-8 h-8 border-t-2 border-b-2 border-blue-400 rounded-full animate-spin"></div>
            ) : user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Sign In
                </button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => openAuthModal('signup')}
                >
                  Sign Up Free
                </Button>
              </div>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <a 
                href="#how-it-works" 
                className="text-gray-300 hover:text-white py-2 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </a>
              <a 
                href="#simulator" 
                className="text-gray-300 hover:text-white py-2 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Try It
              </a>
              <a 
                href="#pricing" 
                className="text-gray-300 hover:text-white py-2 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </a>
              
              {loading ? (
                <div className="flex justify-center py-2">
                  <div className="w-6 h-6 border-t-2 border-b-2 border-blue-400 rounded-full animate-spin"></div>
                </div>
              ) : user ? (
                <div className="pt-2 border-t border-gray-700">
                  <UserMenu />
                </div>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="text-gray-300 hover:text-white py-2 text-sm text-left"
                  >
                    Sign In
                  </button>
                  <Button 
                    variant="primary" 
                    fullWidth
                    onClick={() => openAuthModal('signup')}
                  >
                    Sign Up Free
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Header;