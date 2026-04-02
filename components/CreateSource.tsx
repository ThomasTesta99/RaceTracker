"use client"
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

const CreateSource = () => {
    const [open, setOpen] = useState(false);
    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" size="lg" className='text-black cursor-pointer w-full' onClick={() => console.log("click")}>
                    <Plus />
                    Create Source
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md [&>button]:cursor-pointer text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Create Source</DialogTitle>
                </DialogHeader>

                <div>
                    HIHIHI
                </div>
            </DialogContent>
            
        </Dialog>
    )
}

export default CreateSource
