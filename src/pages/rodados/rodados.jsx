import React, { useState } from "react";
import { Div, H2, Button, Table } from "../../components";

const getMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0=domingo, 1=lunes...
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

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // sábado

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
        {
            header: "Área",
            key: "area",
        },
        {
            header: "Lunes",
            render: () => <div className="h-16"></div>,
        },
        {
            header: "Martes",
            render: () => <div className="h-16"></div>,
        },
        {
            header: "Miércoles",
            render: () => <div className="h-16"></div>,
        },
        {
            header: "Jueves",
            render: () => <div className="h-16"></div>,
        },
        {
            header: "Viernes",
            render: () => <div className="h-16"></div>,
        },
        {
            header: "Sábado",
            render: () => <div className="h-16"></div>,
        },
        {
            header: "Domingo",
            render: () => <div className="h-16"></div>,
        },
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
            {/* BOTONERA SUPERIOR */}
            <Div>
                <H2 label="SISTEMA DE PLANIFICACION DE RODADOS" />
                <div className="flex gap-4 justify-center flex-wrap">
                    <Button
                        text="Nueva solicitud"
                        className="bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded text-white"
                    />
                    <Button
                        text="Solicitudes"
                        className="bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded text-white"
                    />
                    <Button
                        text="Asignación"
                        className="bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded text-white"
                    />
                    <Button
                        text="Choferes"
                        className="bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded text-white"
                    />
                    <Button
                        text="Vehículos"
                        className="bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded text-white"
                    />
                </div>
            </Div>

            <Div>
                <H2 label="GESTION DE AGENTES DE RODADOS" />
                <div className="flex gap-4 justify-center flex-wrap">
                    <Button
                        text="Agregar Vehiculos"
                        className="bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded text-white"
                    />
                    <Button
                        text="Agregar Propietarios"
                        className="bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded text-white"
                    />
                    <Button
                        text="Agregar Choferes"
                        className="bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded text-white"
                    />
                    <Button
                        text="Registrar Chofer Provisorio"
                        className="bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded text-white"
                    />
                </div>
            </Div>

            {/* CALENDARIO */}
            <Div className="w-full x-auto border border-gray-300 p-6 bg-gray-800 rounded-xl mb-8">
                <div className="relative mb-6">
                    <H2 label="CALENDARIO SEMANAL" />
                    <p className="text-white-300 text-lg font-bold mt-1">
                        Semana del {formatDate(weekStart)} al{" "}
                        {formatDate(weekEnd)}
                    </p>
                    <Button
                        text="Semana siguiente →"
                        onClick={nextWeek}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded-xl text-white"
                    />
                    <Button
                        text="← Semana anterior"
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded-xl text-white"
                        onClick={previousWeek}
                    />
                </div>
                <Table columns={columns} data={data} />
            </Div>
        </>
    );
};

export default Rodados;
