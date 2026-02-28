import React, { useState } from "react";
import { Div, H2, Button, Table } from "../../components";
import PlanillaIcon from "../../assets/Planilla_icon.svg";
import OperarioIcon from "../../assets/Operario_icon.svg";
import RelojIcon from "../../assets/Reloj_icon.svg";
import CamionIcon from "../../assets/Camion_icon.svg";

const getMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
};

const formatDate = (date) => {
    return date.toLocaleDateString("es-AR", {
        day: "numeric",
        month: "numeric",
    });
};

const Rodados = () => {
    const [weekStart, setWeekStart] = useState(getMonday(new Date()));
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const previousWeek = () => {
        const prev = new Date(weekStart);
        prev.setDate(weekStart.getDate() - 7);
        setWeekStart(prev);
    };

    const nextWeek = () => {
        const next = new Date(weekStart);
        next.setDate(weekStart.getDate() + 7);
        setWeekStart(next);
    };

    const columns = [
        { header: "Área", key: "area" },
        { header: "Lunes", render: () => <div className="h-16"></div> },
        { header: "Martes", render: () => <div className="h-16"></div> },
        { header: "Miércoles", render: () => <div className="h-16"></div> },
        { header: "Jueves", render: () => <div className="h-16"></div> },
        { header: "Viernes", render: () => <div className="h-16"></div> },
        { header: "Sábado", render: () => <div className="h-16"></div> },
        { header: "Domingo", render: () => <div className="h-16"></div> },
    ];

    const data = [
        { area: "Arbolado" },
        { area: "Espacios Verdes" },
        { area: "Control de Vectores" },
        { area: "Escuela de jardineria" },
        { area: "Vivero" },
        { area: "Taller" },
        { area: "Despacho" },
        { area: "Paisajismo" },
        { area: "Inspeccion" },
        { area: "Departamento Tecnico" },
    ];

    return (
        <>
            <Div>
                <div className="flex items-center justify-center gap-3 mb-6 border-b border-gray-600 pb-3">
                    <img
                        src={CamionIcon}
                        alt="Sistema de Rodados"
                        className="w-8 h-8 opacity-90"
                    />
                    <h2 className="text-white text-xl font-semibold tracking-wide">
                        SISTEMA DE RODADOS
                    </h2>
                </div>

                <div className="flex gap-4 mb-6">
                    {/* PLANIFICACIÓN */}
                    <div className="flex-1">
                        <div
                            onClick={() => toggleSection("planificacion")}
                            className={`cursor-pointer py-3 rounded-lg border border-indigo-500 transition-colors
                ${
                    openSection === "planificacion"
                        ? "bg-indigo-800 text-white"
                        : "bg-indigo-800 text-white hover:bg-indigo-600"
                }`}
                        >
                            <div className="flex items-center justify-center gap-3">
                                <img
                                    src={PlanillaIcon}
                                    alt="Planificación"
                                    className="w-10 h-10 opacity-90"
                                />
                                <span className="text-sm font-medium tracking-wide">
                                    PLANIFICACIÓN
                                </span>
                            </div>
                        </div>

                        {openSection === "planificacion" && (
                            <div className="mt-2 bg-gray-800 border border-gray-600 rounded-lg p-3">
                                <div className="flex flex-col gap-2">
                                    <Button
                                        text="Nueva solicitud"
                                        className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full"
                                    />
                                    <Button
                                        text="Solicitudes"
                                        className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full"
                                    />
                                    <Button
                                        text="Asignación"
                                        className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full"
                                    />
                                    <Button
                                        text="Choferes"
                                        className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full"
                                    />
                                    <Button
                                        text="Vehículos"
                                        className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* AGENTES */}
                    <div className="flex-1">
                        <div
                            onClick={() => toggleSection("agentes")}
                            className={`cursor-pointer py-3 rounded-lg border border-indigo-500 transition-colors
                ${
                    openSection === "agentes"
                        ? "bg-indigo-800 text-white"
                        : "bg-indigo-800 text-white hover:bg-indigo-600"
                }`}
                        >
                            <div className="flex items-center justify-center gap-3">
                                <img
                                    src={OperarioIcon}
                                    alt="Agentes"
                                    className="w-10 h-10 opacity-90"
                                />
                                <span className="text-sm font-medium tracking-wide">
                                    AGENTES
                                </span>
                            </div>
                        </div>

                        {openSection === "agentes" && (
                            <div className="mt-2 bg-gray-800 border border-gray-600 rounded-lg p-3">
                                <div className="flex flex-col gap-2">
                                    <Button
                                        text="Agregar Vehículos"
                                        className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full"
                                    />
                                    <Button
                                        text="Agregar Propietarios"
                                        className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full"
                                    />
                                    <Button
                                        text="Agregar Choferes"
                                        className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full"
                                    />
                                    <Button
                                        text="Registrar Provisorio"
                                        className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* HORAS */}
                    <div className="flex-1">
                        <div
                            onClick={() => toggleSection("horas")}
                            className={`cursor-pointer py-3 rounded-lg border border-indigo-500 transition-colors
                ${
                    openSection === "horas"
                        ? "bg-indigo-800 text-white"
                        : "bg-indigo-800 text-white hover:bg-indigo-600"
                }`}
                        >
                            <div className="flex items-center justify-center gap-3">
                                <img
                                    src={RelojIcon}
                                    alt="Reloj"
                                    className="w-10 h-10 opacity-90"
                                />
                                <span className="text-sm font-medium tracking-wide">
                                    HORAS
                                </span>
                            </div>
                        </div>

                        {openSection === "horas" && (
                            <div className="mt-2 bg-gray-800 border border-gray-600 rounded-lg p-3">
                                <div className="flex flex-col gap-2">
                                    <Button
                                        text="Horas de cupo"
                                        className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full"
                                    />
                                    <Button
                                        text="Horas adicionales"
                                        className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full"
                                    />
                                    <Button
                                        text="Definir adicionales"
                                        className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full"
                                    />
                                    <Button
                                        text="Hojas de ruta"
                                        className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Div>

            {/* CALENDARIO */}
            <Div className="w-full overflow-x-auto border border-gray-300 p-6 bg-gray-800 rounded-xl mb-8">
                <div className="relative mb-6">
                    <H2 label="CALENDARIO SEMANAL" />
                    <p className="text-white text-lg font-bold mt-1 text-center">
                        Semana del {formatDate(weekStart)} al{" "}
                        {formatDate(weekEnd)}
                    </p>

                    <Button
                        text="← Semana anterior"
                        onClick={previousWeek}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded-xl text-white"
                    />

                    <Button
                        text="Semana siguiente →"
                        onClick={nextWeek}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded-xl text-white"
                    />
                </div>

                <Table columns={columns} data={data} />
            </Div>
        </>
    );
};

export default Rodados;
