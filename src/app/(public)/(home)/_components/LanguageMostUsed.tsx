"use client";

import { useEffect, useState } from "react";
import { FiBarChart2 } from "react-icons/fi";

const languages = [
    {
        name: "Python",
        percentage: 25.8,
        description: "Líder absoluta em IA, Ciência de Dados e automação de modelos.",
    },
    {
        name: "JavaScript",
        percentage: 62.3,
        description: "Onipresente no desenvolvimento web e ecossistema full-stack.",
    },
    {
        name: "C++",
        percentage: 10.7,
        description: "Alta performance, motores de jogos e infraestrutura crítica de hardware.",
    },
    {
        name: "Java",
        percentage: 8.8,
        description: "Padrão ouro para sistemas corporativos, bancários e backend robusto.",
    },
    {
        name: "C#",
        percentage: 28.8,
        description: "Pilar do ecossistema .NET, desenvolvimento de jogos e nuvem corporativa.",
    },
];

export const LanguageMostUsed = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <div className="rounded-xl border border-violet-800/40 bg-violet-950/30 p-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <FiBarChart2 className="text-violet-400" />
                Linguagens mais usadas
            </h3>

            <div className="space-y-4">
                {languages.map((lang) => (
                    <div key={lang.name}>
                        <div className="flex justify-between text-xs text-zinc-300">
                            <div>
                                <span className="font-medium">{lang.name}</span>
                                <p className="text-[10px] text-zinc-500">
                                    {lang.description}
                                </p>
                            </div>
                            <span>{lang.percentage}%</span>
                        </div>

                        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mt-1">
                            <div
                                className="h-full bg-violet-500 transition-all duration-1000 ease-out"
                                style={{
                                    width: loaded ? `${lang.percentage}%` : "0%",
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};