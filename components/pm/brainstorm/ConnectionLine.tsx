"use client";

import React from "react";
import type { BrainstormNode, BrainstormConnection } from "@/types/pm-types";

interface Props {
    connections: BrainstormConnection[];
    nodes: BrainstormNode[];
    pendingFrom?: string | null;   // node id currently being connected from
    mousePos?: { x: number; y: number }; // live mouse position for the pending line
}

const getCenter = (node: BrainstormNode) => ({
    x: node.x + node.width / 2,
    y: node.y + node.height / 2,
});

const ConnectionLine: React.FC<Props> = ({ connections, nodes, pendingFrom, mousePos }) => {
    const findNode = (id: string) => nodes.find((n) => n.id === id);

    return (
        <svg
            className="absolute pointer-events-none z-0"
            style={{ 
                left: -5000, 
                top: -5000, 
                width: 10000, 
                height: 10000, 
                overflow: "visible" 
            }}
            xmlns="http://www.w3.org/2000/svg"
        >
            <g transform="translate(5000, 5000)">
            <defs>
                <marker id="bs-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#60a5fa" />
                </marker>
                <marker id="bs-arrow-pending" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
                </marker>
            </defs>

            {/* Existing connections */}
            {connections.map((conn) => {
                const fromNode = findNode(conn.fromNodeId);
                const toNode = findNode(conn.toNodeId);
                if (!fromNode || !toNode) return null;

                const from = getCenter(fromNode);
                const to = getCenter(toNode);
                const midX = (from.x + to.x) / 2;

                return (
                    <g key={conn.id}>
                        <path
                            d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                            fill="none"
                            stroke="#60a5fa"
                            strokeWidth={2}
                            markerEnd="url(#bs-arrow)"
                        />
                        {conn.label && (
                            <text
                                x={(from.x + to.x) / 2}
                                y={(from.y + to.y) / 2 - 6}
                                textAnchor="middle"
                                fontSize={10}
                                fill="#94a3b8"
                                className="pointer-events-none"
                            >
                                {conn.label}
                            </text>
                        )}
                    </g>
                );
            })}

            {/* Pending connection line (while user is drawing) */}
            {pendingFrom && mousePos && (() => {
                const fromNode = findNode(pendingFrom);
                if (!fromNode) return null;
                const from = getCenter(fromNode);
                return (
                    <line
                        x1={from.x} y1={from.y}
                        x2={mousePos.x} y2={mousePos.y}
                        stroke="#94a3b8"
                        strokeWidth={2}
                        strokeDasharray="5 3"
                        markerEnd="url(#bs-arrow-pending)"
                    />
                );
            })()}
            </g>
        </svg>
    );
};

export default ConnectionLine;
