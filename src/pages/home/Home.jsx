import { useState, useEffect } from "react";
import foto1 from "../../assets/Foto1.png";
import foto2 from "../../assets/Foto2.jpg";
import foto3 from "../../assets/Foto3.jpg";

const slides = [foto1, foto2, foto3];

const Home = () => {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    // Autoplay
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="relative w-full max-w-5xl h-72 md:h-96 overflow-hidden rounded-2xl shadow-xl">
                {/* Contenedor deslizante */}
                <div
                    className="flex transition-transform duration-700 ease-in-out h-full"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <img
                            key={index}
                            src={slide}
                            alt={`Slide ${index}`}
                            className="w-full h-full object-cover flex-shrink-0"
                        />
                    ))}
                </div>

                {/* Botón izquierda */}
                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-4 -translate-y-1/2 p-3 "
                >
                    ❮
                </button>

                {/* Botón derecha */}
                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-4 -translate-y-1/2 p-3 "
                >
                    ❯
                </button>

                {/* Indicadores */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={`w-3 h-3 rounded-full cursor-pointer transition ${
                                current === index ? "bg-white" : "bg-white/50"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
