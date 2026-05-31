"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface FallingLettersProps {
  text: string;
  className?: string;
  stagger?: number;
  delay?: number;
  /** Split mode: "letter" for per-letter stagger, "word" for per-word stagger */
  mode?: "letter" | "word";
}

export function FallingLetters({
  text,
  className = "",
  stagger = 0.022,
  delay = 0,
  mode = "letter",
}: FallingLettersProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const words = text.split(" ");

  if (mode === "word") {
    return (
      <span ref={ref} className={className} aria-label={text} style={{ display: "inline" }}>
        {words.map((word, wi) => (
          <motion.span
            key={wi}
            className="inline-block"
            initial={{ opacity: 0, y: -14, rotateX: 35, filter: "blur(5px)" }}
            animate={inView ? { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" } : {}}
            transition={{
              delay: delay + wi * stagger * 4,
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ transformOrigin: "top center" }}
          >
            {word}
            {wi < words.length - 1 && " "}
          </motion.span>
        ))}
      </span>
    );
  }

  // Letter mode: stagger each character
  let globalIndex = 0;

  return (
    <span ref={ref} className={className} aria-label={text} style={{ display: "inline" }}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split("").map((char) => {
            const idx = globalIndex++;
            return (
              <motion.span
                key={idx}
                className="inline-block"
                initial={{ opacity: 0, y: -10, rotateX: 45, filter: "blur(4px)" }}
                animate={inView ? { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" } : {}}
                transition={{
                  delay: delay + idx * stagger,
                  duration: 0.48,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ transformOrigin: "top center" }}
              >
                {char}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  );
}
