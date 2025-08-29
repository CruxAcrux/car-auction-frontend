function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs">&copy; {new Date().getFullYear()} CarAuction. All rights reserved.</p>
        <div className="mt-1 space-x-3">
          <a href="/about" className="text-xs hover:text-blue-400 transition">About</a>
          <a href="/contact" className="text-xs hover:text-blue-400 transition">Contact</a>
          <a href="/terms" className="text-xs hover:text-blue-400 transition">Terms</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;