import React from 'react'

const Navbar = () => {
    return (
        <div>
            <nav class="navbar" style={
                {
                    padding: '10px 20px',
                    boxShadow: '0px 0px 4px',
                    height: '60px',
                    position: 'fixed',
                    width: '100%',
                    zIndex: 1000,
                    background: '#cfcfe6'
                }
            }>
                <div className='d-flex align-items-center' >
                <a class="navbar-brand text-white" href="#">
                        <img src="https://www.vedantalimited.com/img/vedanta-logo.svg" alt="" style={{width:'150px',}} />
                    </a>
                    {/* <div style={{fontSize:'26px'}}>Vedanta</div> */}
                </div>

            </nav>
        </div>
    )
}

export default Navbar
