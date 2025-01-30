import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { Card } from '@mui/material'
import thank from '../../assets/thank.gif'
import { useLocation } from 'react-router-dom'
import QRCode from "react-qr-code";

const ShowQrcode = () => {

      const location = useLocation();
      const [url, setUrl] = useState('');
      const [uid, setUid] = useState('');
      const [fullurl, setfulurl] = useState('')
    
      useEffect(() => {
        if (location.state) {
          setUrl(location.state.url);  // Extract the URL from the state
          setUid(location.state.uid);  // Extract the uid from the state
          setfulurl(`${'192.168.1.50:5000/#/Score'}?uid=${location.state.uid}`)
          console.log(`${'http://192.168.1.50:5000/#/Score'}?uid=${location.state.uid}`);
        }
      }, [location]);

    return (
        <div>
            <div>
                <Navbar />
                <div className="app-container">
                    <div className="container-fluid" style={{ marginTop: '80px', marginBottom: '20px' }}>
                        <Card className='p-2 p-lg-5' sx={{
                            backgroundColor: 'transparent',
                            boxShadow: '0px 0px 4px',
                            borderRadius: '10px',
                            padding:'20px',
                            display:'flex',
                            justifyContent:'center',
                            alignItems:'center'
                        }}>
                            <div className="showqrcode ">
                            <h2 style={{fontSize:'20px'}}>Thank you for your contribution towards a greener tomorrow  </h2>
                                <div className="qrcode bg-white mx-auto" style={{width:'300px', maxWidth:'100%', marginTop:'20px'}}>
                                <QRCode
                                value={fullurl} 
                                size={300}
                                style={{padding:'20px'}}
                                />
                                </div>

                                <div className="qrtext text-center mt-5">
                               
                                <img src={thank} alt="" />
                                </div>
                            </div>

                        </Card>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ShowQrcode
