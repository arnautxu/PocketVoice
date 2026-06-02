"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

type NavItem = { name: string; href: string };
interface NavProps { items: NavItem[]; className?: string }

// ============================================================================
// 7. THE "FLOATING ISLAND" NAV
// Physics: Expands from a dot to a menu on hover.
// ============================================================================
export const FloatingIslandNav = ({ items, className }: NavProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            className={cn("bg-black text-white rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden flex items-center justify-center", isOpen ? "w-96 px-6 py-3 h-14" : "w-4 h-4 p-0", className)}
        >
            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex gap-6 w-full justify-between whitespace-nowrap"
                    >
                        {items.map(item => (
                            <a key={item.name} href="#" className="hover:text-gray-300 text-sm font-medium">{item.name}</a>
                        ))}
                    </motion.div>
                ) : (
                    <div className="w-2 h-2 bg-white rounded-full" />
                )}
            </AnimatePresence>
        </nav>
    );
};
