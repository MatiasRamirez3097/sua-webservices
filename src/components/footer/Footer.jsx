const Footer = () => (
    <footer className="mt-auto border-t border-accent/40 bg-night-deep text-night-muted">
        <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-6 px-4 py-8 text-sm sm:px-6">
            <div>
                <p className="font-semibold text-white">
                    SUA <span className="font-normal text-accent-bright">Webservices</span>
                </p>
                <p className="mt-1">Dirección General de Parques y Paseos · Municipalidad de Rosario</p>
            </div>
            <div className="sm:text-right">
                <p>Desarrollado por el Centro de Informática Local</p>
                <a
                    href="https://www.rosario.gob.ar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-accent-bright transition-colors hover:text-white"
                >
                    rosario.gob.ar
                </a>
            </div>
        </div>
    </footer>
);

export default Footer;
