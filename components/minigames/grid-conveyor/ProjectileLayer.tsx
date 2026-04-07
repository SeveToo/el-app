import React from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Projectile } from "./types";

interface ProjectileLayerProps {
  projectiles: Projectile[];
}

export const ProjectileLayer: React.FC<ProjectileLayerProps> = React.memo(
  ({ projectiles }) => {
    return (
      <div className="absolute inset-x-0 bottom-0 top-[300px] pointer-events-none z-50 overflow-visible">
        <AnimatePresence>
          {projectiles.map((p) => (
            <motion.div
              key={p.id}
              animate={{
                y: p.toBelt === "green" ? -420 : -320,
                opacity: [1, 1, 0],
                scale: [0.5, 1.2, 0.8],
              }}
              className="absolute left-1/2 -ml-4 w-8 h-8 flex items-center justify-center text-2xl z-50"
              exit={{ opacity: 0 }}
              initial={{ y: 200, opacity: 1, scale: 0.5 }}
              transition={{ duration: 0.4, ease: "circOut" }}
            >
              🚀
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  },
);

ProjectileLayer.displayName = "ProjectileLayer";
