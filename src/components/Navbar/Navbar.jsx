import { useState, useContext, useCallback } from 'react'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai'
import { auth } from '../../config/Config'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css';
import { CgShoppingCart } from "react-icons/cg"
import { UserContext } from '../../context/UserContextProvider'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/glass', label: 'Glass' },
  { to: 'https://www.instagram.com/synthesis_glass/', label: 'Instagram', external: true },
]

const BTN_CLASS = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'

const NavLink = ({ to, label, external, className, toggleMobile }) => (
  <li className={className} onClick={toggleMobile}>
    {external
    
      ? <a href={to} target="_blank" rel="noopener noreferrer" >{label}</a>
      : <Link to={to} onClick={toggleMobile}>{label}</Link>
    }
  </li>
)

const Navbar = () => {
  const { user } = useContext(UserContext)
  console.log(user)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  let isAdmin = false
  console.log(isAdmin)
  try {
    const stored = JSON.parse(localStorage.getItem('user'))
    
    isAdmin = stored?.uid === process.env.REACT_APP_ADMIN_ID
  } catch { /* ignored */ }

  const cartCount = user?.cart?.length || 0
  
  const handleLogout = useCallback(() => {
    auth.signOut().then(() => {
      setMobileOpen(false)
      window.localStorage.clear()
      navigate('/signin')
    })
  }, [navigate])

  const toggleMobile = useCallback(() => {
    setMobileOpen(prev => !prev)
  }, [])

  return (
    <div className='text-white flex justify-between item-center h-24 mx-auto px-4 sticky top-0 bg-gradient-to-r from-[#762a99] to-[#7c0747] bg-no-repeat z-50'>
      <div className="header">
        <h1 className="logo">Synthesis Glass</h1>
      </div>
      <ul className='hidden md:flex'>
        {user?
       (isAdmin?""
        :
        <li className='p-4'>
          <Link to="/cart" ><CgShoppingCart />{cartCount > 0 && cartCount}</Link>
        </li>
       ):""}
        {NAV_LINKS.map(link => (
          <NavLink key={link.to} {...link} className='p-4' />
        ))}
        
        {user?
          (isAdmin
           ? <li className='p-4'><Link to="/admin">Admin</Link></li>
            : <li className='p-4'><Link to={`/account/${user?.id}`}>Account</Link></li>
          )
          :
          ""}
        <li className='p-4'>
          {user === null
            ? <Link to="/signin"><button className={BTN_CLASS}>Sign In</button></Link>
            : <button className={BTN_CLASS} onClick={handleLogout}>Logout</button>
          }
        </li>
      </ul>
      <div onClick={toggleMobile} className='mt-4 block md:hidden'>
        {mobileOpen ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>
      <div className={mobileOpen ? 'fixed left-0 top-0 w-[60%] ease-in-out duration-500 bg-white mt-20 text-black' : 'fixed left-[-100%]'}>
        <ul className='uppercase'>
             <li className='p-4 border-b'><Link to="/" onClick={toggleMobile}>Home</Link></li>
            <li className='p-4 border-b'><Link to="/glass" onClick={toggleMobile}>Glass</Link></li>
            <li className='p-4 border-b'><Link to="https://www.instagram.com/synthesis_glass/" target="_blank" rel="noopener noreferrer" onClick={toggleMobile}>Instagram</Link></li>
          {user?
            (isAdmin
              ? <li className='p-4 border-b'><Link to="/admin" onClick={toggleMobile}>Admin</Link></li>
              : <li className='p-4 border-b'><Link to={`/account/${user?.id}`}onClick={toggleMobile}>Account</Link></li>
            )
            :""
          }{user ?
          (isAdmin ? ""
          :
          <li className='p-4 border-b'>
            <Link to="/cart"onClick={toggleMobile}>Cart{cartCount > 0 && ` ${cartCount}`}</Link>
          </li>):""}
          <li className='p-4'>
            {user === null
              ? <Link to="/signin"onClick={toggleMobile}><button className={BTN_CLASS}>Sign In</button></Link>
              : <button onClick={handleLogout}>LOGOUT</button>
            }
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
