"use client";

import { GetSourcesResponse, Source } from "@/types";
import React, { useCallback, useEffect, useState } from "react";
import CreateSource from "./SourceDialog";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";
import SourceDialog from "./SourceDialog";

const RaceSources = () => {
  const [sourcesList, setSourcesList] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchSources = useCallback(async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/sources");
      const result: GetSourcesResponse = await res.json();

      if (result.success) {
        setSourcesList(result.sourcesList);
      } else {
        setSourcesList([]);
        setMessage(result.message || "Failed to load sources");
      }
    } catch (error) {
      console.error(error);
      setSourcesList([]);
      setMessage("Failed to load sources");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  if (loading) {
    return (
      <section className="min-h-screen px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold tracking-tight">Sources</h1>
          <p className="mt-3 text-white/60">Loading sources...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Sources</h1>
            <p className="mt-2 text-white/60">
              Manage the sources your race data comes from.
            </p>
          </div>

          <div className="w-full md:w-[240px]">
            <CreateSource onSourceSaved={fetchSources} />
          </div>
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {message}
          </div>
        )}

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          {sourcesList.length === 0 ? (
            <div className="px-6 py-10 text-center text-white/60">
              No sources yet. Create your first source.
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {sourcesList.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center justify-between gap-4 px-6 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-lg font-medium text-white">
                      {source.name}
                    </p>
                    <p className="mt-1 text-sm text-white/40">
                      ID: {source.id}
                    </p>
                  </div>

                  <SourceDialog
                    source={source}
                    onSourceSaved={fetchSources}
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer text-black"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RaceSources;