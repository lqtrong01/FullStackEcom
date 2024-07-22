import React from "react";
import { Link, NavLink } from "react-router-dom";

const FooterLinks = [
    {
        title:'Home',
        to:'/home'
    },
    {
        title:'About',
        to:'/#about'
    },
    {
        title:'Contact',
        to:'/#contact'
    },
    {
        title:'Blog',
        to:'/#blog'
    }
]

export default function Footer(){
    return (
        <>
        <div className="dark:bg-gray-800/90 dark:text-white">
            <div className="container">
                <div className="grid md:grid-cols-3 pb-20 pt-5">
                    <div className="py-8 px-4">
                        <Link to={'/'}
                            className="text-primary font-semibold tracking-widest text-2xl uppercase sm:text-3xl"
                        >
                            IDK
                        </Link>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum ea omnis illo, fugit architecto cum quidem culpa pariatur, minima vero saepe in aliquid, ut adipisci perspiciatis quisquam odit? Distinctio, vero.</p>

                    </div>
                    <div className="col-san-2 grid grid-cols-2 sm:grid-cols-3 md:pl-10">
                        <div className="py-8 px-4">
                            <h1 className="Text-xl font-bold sm:text-left mb-3">Important Links</h1>
                            <NavLink className="space-y-3 list-none">
                                {FooterLinks.map((item, index)=>(
                                    <li key={index}>
                                        <Link 
                                            to={item.to}
                                            className="hover:text-black duration-300"
                                        >{item.title}
                                        </Link>
                                    </li>
                                ))}
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}