"use client"
import { GetSourcesResponse, Source } from '@/types';
import React, { useEffect, useState } from 'react'
import CreateSource from './CreateSource';

const RaceSources = () => {
    const [sourcesList, setSourcesList] = useState<Source[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchSources = async () => {
            try {
                const res = await fetch("/api/sources");
                const result: GetSourcesResponse = await res.json();

                if(result.success){
                    setSourcesList(result.sourcesList);
                }else{
                    setMessage(result.message);
                }
            } catch (error) {
                console.error(error);
                setMessage("Failed to load sources");
            }finally{
                setLoading(false);
            }
        }

        fetchSources();
    }, [])

    if(loading){
        return (
            <section className="min-h-screen px-6 py-10 text-white">
                <div className="mx-auto max-w-4xl">
                    <h1 className="text-4xl font-bold tracking-tight">Sources</h1>
                    <p className="mt-3 text-white/60">Loading sources...</p>
                </div>
            </section>
        )
    }

    if (message) {
        return (
            <section className="min-h-screen px-6 py-10 text-white">
                <div className="mx-auto max-w-4xl">
                    <h1 className="text-4xl font-bold tracking-tight">Sources</h1>
                    <div className="mt-6 border-b border-white/10 pb-4 text-white/70">
                        {message}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="min-h-screen px-6 py-10">
                <div className="flex flex-col mx-auto max-w-5xl">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Sources</h1>
                        <p className="mt-2 text-white/60">
                            Manage the sources your race data comes from.
                        </p>
                    </div>
                </div>
                <div className='mt-5'>
                    <CreateSource />
                </div>
            </section>
        </>
    )
}

export default RaceSources
