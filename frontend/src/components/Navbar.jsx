function Navbar() {
  return (
    <header className="navbar">
      <div>
        <p className="eyebrow">Operations Center</p>
        <h2>Pulse Board</h2>
      </div>
      <nav className="navbar-links">
        <a href="#overview">Overview</a>
        <a href="#alerts">Alerts</a>
        <a href="#summary">Summary</a>
      </nav>
    </header>
  )
}

export default Navbar
