import Slider from "react-slick";
import Button from "../core/Button";
import React, { useEffect } from "react";
import Image1 from "../../assets/category/headphone.png";
import Image2 from "../../assets/category/vr.png";
import Image3 from "../../assets/category/macbook.png";
import Image4 from "../../assets/category/gaming.png"
import Aos from "aos";
import 'aos/dist/aos.css'
const datas = [
    {
        id: 1,
        img: Image1,
        subtitle: "Beats Solo",
        title: "Wireless",
        name: 'Headphone',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ullam placeat quos nesciunt cum rem asperiores, culpa explicabo, vel possimus qui earum corporis autem tempora repellat, alias beatae quas nostrum.'
    },
    {
        id: 2,
        img: Image2,
        subtitle: "Beats Solo",
        title: "Wireless",
        name: 'VR',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ullam placeat quos nesciunt cum rem asperiores, culpa explicabo, vel possimus qui earum corporis autem tempora repellat, alias beatae quas nostrum.'
    },
    {
        id: 3,
        img: Image3,
        subtitle: "Beats Solo",
        title: "Wireless",
        name: 'Laptop',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ullam placeat quos nesciunt cum rem asperiores, culpa explicabo, vel possimus qui earum corporis autem tempora repellat, alias beatae quas nostrum.'
    },
    {
        id: 4,
        img: Image4,
        subtitle: "Beats Solo",
        title: "Controller",
        name: 'Gaming Box',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ullam placeat quos nesciunt cum rem asperiores, culpa explicabo, vel possimus qui earum corporis autem tempora repellat, alias beatae quas nostrum.'
    },
];
Aos.init({
    duration: 800,
    easing: 'ease-in-sine',
    delay: 100,
    offset: 100,
})
Aos.refresh();


const Hero = () => {
    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 800,
        slidesToScroll: 1,
        autoplaySpeed: 4000,
        cssEase: "ease-in-out",
        pauseonHover: false,
        pauseOnFocus: true,
    };

    return (
        <>
            <div className="w-full dark:bg-gray-800/90 p-10">
                <div className="container">
                    <div className="overflow-hidden rounded-3xl min-h-[550px] sm:min-h-[650px] dark:text-white hero-bg-color flex justify-center items-center">
                        <div className="container bg-gray-400/80 dark:bg-gray-400 pt-10 pb-8 sm:pb-0">
                            {/*Hero section*/}
                            <Slider {...settings}>
                                {datas.map((item) => (
                                    <div className="grid grid-cols-1 sm:grid-cols-2">
                                        <div key={item.id} className="flex flex-col justify-center gap-4 sm:pl-3 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10">
                                            <h1
                                                data-aos="zoom-out"
                                                data-aos-duration='500'
                                                data-aos-once='true'
                                                className="text-2xl sm:text-6xl lg:text-2xl font-bold">{item.subtitle}</h1>
                                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold">{item.title}</h1>
                                            <h1 className="text-5xl uppercase text-white dark:text-white/50 sm:text-[80px] md:text-[100px] xl:text-[150px] font-bold">{item.name}</h1>
                                            <div>
                                                <Button
                                                    text="Shop By Category"
                                                    bgColor="bg-primary"
                                                    textColor="text-white"
                                                    handler={() => { }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <img
                                                    src={item.img}
                                                    alt=""
                                                    className="w-[300px] h-[300px] sm:h-[450px] sm:w-[450px] sm:scale-105 lg:scale-110 object-contain mx-auto drop-shadow-[-8px_4px_6px_rgba(0,0,0,.4)] relative z-40"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                ))}
                            </Slider>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Hero;
