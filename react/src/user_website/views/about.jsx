import React from 'react'
import { BsDatabase, BsClipboardData} from 'react-icons/bs';
import { AiOutlineUsergroupAdd} from 'react-icons/ai';
const About = () => {
  return (
    <>
    <div className='about'>
        <div className='about_banner'>
            <p>Home.About</p>
            <h2>About Us</h2>
        </div>
        <div className='about_info'>
            <div className='left'>
                <h3>about myself</h3>
                <p>inappropriate behavior is often laughed off as “boys will be boys,” women face higher conduct standards especially in the workplace. That’s why it’s crucial that, as women, our behavior on the job is beyond reproach. inappropriate behavior is often laughed.</p>
                <div className='box_container'>
                    <div className='box'>
                        <div className='icon'>
                            <BsDatabase />
                        </div>
                        <h3>$ 2.5M</h3>
                        <p>Total Donation</p>
                    </div>
                    <div className='box'>
                        <div className='icon'>
                            <BsClipboardData />
                        </div>
                        <h3>1435</h3>
                        <p>Total Projects</p>
                    </div>
                    <div className='box'>
                        <div className='icon'>
                            <AiOutlineUsergroupAdd />
                        </div>
                        <h3>2965</h3>
                        <p>Total Volunteers</p>
                    </div>
                </div>
            </div>
            <div className='right'>
                <div className='container'>
                    <h3>TOOLS EXPERTNESS</h3>
                    <div className='contant'>
                        <h3>After Effects 85%</h3>
                        <div className='box'>
                            <div className='fieldAE'></div>
                        </div>
                    </div>
                    <div className='contant'>
                        <h3>Photoshop 80%</h3>
                        <div className='box'>
                            <div className='fieldP'></div>
                        </div>
                    </div>
                    <div className='contant'>
                        <h3>illustrator 70%</h3>
                        <div className='box'>
                            <div className='fieldI'></div>
                        </div>
                    </div>
                    <div className='contant'>
                        <h3>sketch 90%</h3>
                        <div className='box'>
                            <div className='fieldS'></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default About