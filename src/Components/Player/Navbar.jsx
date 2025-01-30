import React from 'react'
import vedantalogo from '../../assets/vedantalogo.png'
import cairnlogo from '../../assets/cairnlogo.png'

const Navbar = () => {
    return (
        <div>
            <nav class="navbar" style={
                {
                    padding: '0px 20px',
                    boxShadow: '0px 0px 4px',
                    height: '60px',
                    position: 'fixed',
                    width: '100%',
                    zIndex: 1000,
                    background: '#cfcfe6',
                    display:'flex',
                    justifyContent:'space-between',
                    alignItems:'center'
                }
            }>
                <div>
                <a class="navbar-brand text-white" href="#">
                        <img src={vedantalogo} alt="" style={{width:'170px',}} />
                    </a>

                </div>
                <div >
                <a class="navbar-brand text-white" href="#">
                        <img src={cairnlogo} alt="" style={{width:'50px',}} />
                    </a>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
